import Principal "mo:base/Principal";

module {
    public type TokenAddress = Principal;
    public type TokenId = Nat;

    public type ApiError = {
        #Unauthorized;
        #InvalidTokenId;
        #ZeroAddress;
        #Other;
    };

    public type OwnerResult = {
        #Err: ApiError;
        #Ok: Principal
    };

    public type TxReceipt = {
        #Err: ApiError;
        #Ok: Nat;
    };

    public type InterfaceId =
     {
       #Approval;
       #TransactionHistory;
       #Mint;
       #Burn;
       #TransferNotification;
     };

    public type LogoResult = 
    {
        logo_type: Text; // MIME type of the logo
        data: Text // Base64 encoded logo
    };

    public type ExtendedMetadataResult =
    {
        metadata_desc: MetadataDesc;
        token_id: TokenId;
    };

    public type MetadataResult =
    {
      #Err: ApiError;
      #Ok: MetadataDesc;
    };

    public type MetadataDesc = [MetadataPart];

    public type MetadataPart =
    {
      purpose: MetadataPurpose;
      key_val_data: [MetadataKeyVal];
      data: Text;
    };

    public type MetadataPurpose =
    {
      #Preview; // used as a preview, can be used as preivew in a wallet
      #Rendered; // used as a detailed version of the NFT
    };

    public type MetadataKeyVal = (Text, MetadataVal);

    public type MetadataVal =
    {
      #TextContent : Text;
      #BlobContent : Blob;
      #NatContent : Nat;
      #Nat8Content: Nat8;
      #Nat16Content: Nat16;
      #Nat32Content: Nat32;
      #Nat64Content: Nat64;
     };

    public type MintReceipt =
    {
      #Err: { #Unauthorized; };
      #Ok: {
             token_id: TokenId; // minted token id
             id: Nat // transaction id
          };
    };
    public type HttpRequest = {
      method : Text;
      url : Text;
      headers : [HeaderField];
      body : Blob;
    };
    public type HeaderField = (Text, Text);
    public type HttpResponse = {
      status_code: Nat16;
      headers: [HeaderField];
      body: Blob;
    };
}