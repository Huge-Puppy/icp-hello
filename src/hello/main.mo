import Array "mo:base/Array";
import Blob "mo:base/Blob";
import Cycles "mo:base/ExperimentalCycles";
import Error "mo:base/Error";
import Hash "mo:base/Hash";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import Nat "mo:base/Nat";
import Option "mo:base/Option";
import Principal "mo:base/Principal";
import Result "mo:base/Result";
import Text "mo:base/Text";

import T "hello_types";

shared ({ caller = creator }) actor class HelloNft() = {
    let _name = "hello";
    let _symbol = "$";
    let _zeroAddress = Principal.fromText("");
    private stable var minter : Principal = creator;
    private stable var tokenPk : Nat = 0;

    private stable var tokenURIEntries : [(T.TokenId, Text)] = [];
    private stable var ownersEntries : [(T.TokenId, Principal)] = [];
    private stable var balancesEntries : [(Principal, Nat)] = [];
    private stable var tokenMetadataEntries : [(T.TokenId, T.MetadataDesc)] = [];

    private let tokenURIs : HashMap.HashMap<T.TokenId, Text> = HashMap.fromIter<T.TokenId, Text>(tokenURIEntries.vals(), 0, Nat.equal, Hash.hash);
    private let owners : HashMap.HashMap<T.TokenId, Principal> = HashMap.fromIter<T.TokenId, Principal>(ownersEntries.vals(), 0, Nat.equal, Hash.hash);
    private let balances : HashMap.HashMap<Principal, Nat> = HashMap.fromIter<Principal, Nat>(balancesEntries.vals(), 0, Principal.equal, Principal.hash);
    private let tokenMetadata : HashMap.HashMap<T.TokenId, T.MetadataDesc> = HashMap.fromIter<T.TokenId, T.MetadataDesc>(tokenMetadataEntries.vals(), 0, Nat.equal, Hash.hash);

    // preserve state on upgrade
    system func preupgrade() {
        tokenURIEntries := Iter.toArray<(T.TokenId, Text)>(tokenURIs.entries());
        ownersEntries := Iter.toArray<(T.TokenId, Principal)>(owners.entries());
        balancesEntries := Iter.toArray<(Principal, Nat)>(balances.entries());
        tokenMetadataEntries := Iter.toArray<(T.TokenId, T.MetadataDesc)>(tokenMetadata.entries());
    };

    system func postupgrade() {
        tokenURIEntries := [];
        ownersEntries := [];
        balancesEntries := [];
        tokenMetadataEntries := [];
    };

    // cycles management
    public func acceptCycles() : () {
        let available = Cycles.available();
        let accepted = Cycles.accept(available);
        assert(available == accepted);
    };

    public query func balance() : async Nat {
        Cycles.balance();
    };

    // manage minting power
    public shared({ caller }) func setMinter(new : Principal) : async Result.Result<(), T.ApiError> {
        if (caller != minter) return #err(#Unauthorized);
        minter := new;
        #ok();
    };

    // helper fxs
    func _getBalance(user: Principal) : Nat {
        switch(balances.get(user)) {
            case null 0;
            case (?val) val;
        };
    };

    func _getOwner(token_id: T.TokenId) : T.OwnerResult {
        switch(owners.get(token_id)) {
            case(null) {
                return #Err(#InvalidTokenId);
            };
            case(?principal) {
                return #Ok(principal);
            };
        };
    };

    // dip721 general, mint, and burn interfaces

    // logoDip721
    // Returns the logo of the NFT contract
    public query func logo() : async T.LogoResult {
        {logo_type= "text/plain"; data= "JA=="};
    };

    // nameDip721
    // Return the name of the NFT contract
    public query func name() : async Text {
        _name;
    };

    // symbolDip721
    // Returns the symbol of the NFT contract
    public query func symbol() : async Text {
        _symbol;
    };

    // totalSupplyDip721
    // Returns the total current supply of NFT tokens. NFTs that are minted and later burned explictely or sent to the zero address should also count towards totalSupply.
    public query func totalSupply() : async T.TokenId {
        tokenPk + 1;
    };

    // balanceOfDip721
    // Count of all NFTs assigned to user.
    public query func balanceOf(user: Principal) : async Nat {
        _getBalance(user);
    };

    // ownerOfDip721
    // Returns the owner of the NFT associated with token_id. Returns ApiError.InvalidTokenId, if the token id is invalid.
    public query func ownerOf(token_id: T.TokenId) : async T.OwnerResult {
        _getOwner(token_id);
    };

    // safeTransferFromDip721
    // Safely transfers token_id token from user from to user to. 
    // If to is zero, then ApiError.ZeroAddress should be returned. 
    // If the caller is neither the owner, nor an approved operator, 
    // nor someone approved with the approveDip721 function, then ApiError.Unauthorized should be returned. 
    // If token_id is not valid, then ApiError.InvalidTokenId is returned.
    public shared({caller}) func safeTransferFrom(from: Principal, to: Principal, token_id: T.TokenId) : async T.TxReceipt {
        if (to == _zeroAddress) return #Err(#ZeroAddress);
        if (from != caller) return #Err(#Unauthorized);
        let ownerResult : T.OwnerResult = _getOwner(token_id);
        switch(ownerResult) {
            case(#Err(error)) return #Err(error);
            case(#Ok(principal)) {
                if (principal != from) return #Err(#Unauthorized);
            };
        };
        // transfer the token
        owners.put(token_id, to);
        // update the balances
        balances.put(from, _getBalance(from) - 1);
        balances.put(to, _getBalance(to) + 1);
        #Ok(token_id);
    };

    // transferFromDip721
    // Identical to safeTransferFromDip721 except that this function doesn't check whether the to is a zero address or not.
    public shared({caller}) func transferFrom(from: Principal, to: Principal, token_id: T.TokenId) : async T.TxReceipt {
        if (from != caller) return #Err(#Unauthorized);
        let ownerResult : T.OwnerResult = _getOwner(token_id);
        switch(ownerResult) {
            case(#Err(error)) return #Err(error);
            case(#Ok(principal)) {
                if (principal != from) return #Err(#Unauthorized);
            };
        };
        // transfer the token
        owners.put(token_id, to);
        // update the balances
        balances.put(from, _getBalance(from) - 1);
        balances.put(to, _getBalance(to) + 1);
        #Ok(token_id);
    };

    // supportedInterfacesDip721
    // Returns the interfaces supported by this smart contract.
    public query func supportedInterfaces() : async [T.InterfaceId] {
        [#Mint, #Burn];
    };

    // getMetadataDip721
    // Returns the metadata for token_id. Returns ApiError.InvalidTokenId, if the token_id is invalid.
    
    public query func getMetadata(token_id: T.TokenId) : async T.MetadataResult {
        if (token_id > tokenPk) return #Err(#InvalidTokenId);
        switch(tokenMetadata.get(token_id)) {
            case null return #Ok([]);
            case(?metadataDesc) return #Ok(metadataDesc);
        };
    };

    // getMetadataForUserDip721
    // Returns all the metadata for the coins user owns.
    public func getMetadataForUser(user: Principal) : async [T.ExtendedMetadataResult] {
        var userMetadata : [T.ExtendedMetadataResult] = [];
        label find for ((id, principal) in owners.entries()) {
            if (principal == user) {
                switch(tokenMetadata.get(id)) {
                    case null continue find;
                    case (?metadata) {
                        userMetadata := Array.tabulate<T.ExtendedMetadataResult>(userMetadata.size()+1, 
                        func(i : Nat) {
                            if (i < userMetadata.size()) {
                                return userMetadata[i];
                            } else {
                                return {metadata_desc = metadata; token_id = id};
                            };
                        });
                    };
                };
            };
        };
        userMetadata;
    };

    // mintDip721
    // Mint an NFT for principal to. The parameter blobContent is non zero, if the NFT contract embeds the NFTs in the smart contract. 
    // Implementations are encouraged to only allow minting by the owner of the smart contract. 
    // Returns ApiError.Unauthorized, if the caller doesn't have the permission to mint the NFT.
    public shared({caller}) func mint(to: Principal, metadataDesc : T.MetadataDesc, tokenURI: Text) : async T.MintReceipt {
        if (caller != minter) return #Err(#Unauthorized);
        tokenURIs.put(tokenPk, tokenURI);
        owners.put(tokenPk, to);
        tokenMetadata.put(tokenPk, metadataDesc);
        balances.put(to, _getBalance(to)+1);
        tokenPk += 1;
        #Ok({
            token_id = tokenPk-1;
            id = tokenPk-1;
        });
    };

    // burnDip721
    // Burn an NFT identified by token_id. Implementations are encouraged to only allow burning by the owner of the token_id. 
    // Returns ApiError.Unauthorized, if the caller doesn't have the permission to burn the NFT. 
    // Returns ApiError.InvalidTokenId, if the provided token_id doesn't exist.
    public shared({caller}) func burn(token_id : T.TokenId) : async T.TxReceipt {
        switch(_getOwner(token_id)) {
            case(#Err(error)) return #Err(error);
            case(#Ok(owner)) {
                if (owner != caller) return #Err(#Unauthorized);
                tokenURIs.delete(token_id);
                owners.delete(token_id);
                tokenMetadata.delete(token_id);
                balances.put(owner, _getBalance(owner)-1);
                return #Ok(token_id);
            };
        };
    };
};