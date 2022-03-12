export const idlFactory = ({ IDL }) => {
  const TokenId = IDL.Nat;
  const ApiError = IDL.Variant({
    'ZeroAddress' : IDL.Null,
    'InvalidTokenId' : IDL.Null,
    'Unauthorized' : IDL.Null,
    'Other' : IDL.Null,
  });
  const TxReceipt = IDL.Variant({ 'Ok' : IDL.Nat, 'Err' : ApiError });
  const MetadataVal = IDL.Variant({
    'Nat64Content' : IDL.Nat64,
    'Nat32Content' : IDL.Nat32,
    'Nat8Content' : IDL.Nat8,
    'NatContent' : IDL.Nat,
    'Nat16Content' : IDL.Nat16,
    'BlobContent' : IDL.Vec(IDL.Nat8),
    'TextContent' : IDL.Text,
  });
  const MetadataKeyVal = IDL.Tuple(IDL.Text, MetadataVal);
  const MetadataPurpose = IDL.Variant({
    'Preview' : IDL.Null,
    'Rendered' : IDL.Null,
  });
  const MetadataPart = IDL.Record({
    'data' : IDL.Text,
    'key_val_data' : IDL.Vec(MetadataKeyVal),
    'purpose' : MetadataPurpose,
  });
  const MetadataDesc = IDL.Vec(MetadataPart);
  const MetadataResult = IDL.Variant({ 'Ok' : MetadataDesc, 'Err' : ApiError });
  const ExtendedMetadataResult = IDL.Record({
    'token_id' : TokenId,
    'metadata_desc' : MetadataDesc,
  });
  const HeaderField = IDL.Tuple(IDL.Text, IDL.Text);
  const HttpRequest = IDL.Record({
    'url' : IDL.Text,
    'method' : IDL.Text,
    'body' : IDL.Vec(IDL.Nat8),
    'headers' : IDL.Vec(HeaderField),
  });
  const HttpResponse = IDL.Record({
    'body' : IDL.Vec(IDL.Nat8),
    'headers' : IDL.Vec(HeaderField),
    'status_code' : IDL.Nat16,
  });
  const LogoResult = IDL.Record({ 'data' : IDL.Text, 'logo_type' : IDL.Text });
  const MintReceipt = IDL.Variant({
    'Ok' : IDL.Record({ 'id' : IDL.Nat, 'token_id' : TokenId }),
    'Err' : IDL.Variant({ 'Unauthorized' : IDL.Null }),
  });
  const OwnerResult = IDL.Variant({ 'Ok' : IDL.Principal, 'Err' : ApiError });
  const Result = IDL.Variant({ 'ok' : IDL.Null, 'err' : ApiError });
  const InterfaceId = IDL.Variant({
    'Burn' : IDL.Null,
    'Mint' : IDL.Null,
    'Approval' : IDL.Null,
    'TransactionHistory' : IDL.Null,
    'TransferNotification' : IDL.Null,
  });
  return IDL.Service({
    'acceptCycles' : IDL.Func([], [], ['oneway']),
    'balance' : IDL.Func([], [IDL.Nat], ['query']),
    'balanceOf' : IDL.Func([IDL.Principal], [IDL.Nat], ['query']),
    'burn' : IDL.Func([TokenId], [TxReceipt], []),
    'getMetadata' : IDL.Func([TokenId], [MetadataResult], ['query']),
    'getMetadataForUser' : IDL.Func(
        [IDL.Principal],
        [IDL.Vec(ExtendedMetadataResult)],
        [],
      ),
    'giveGold' : IDL.Func([IDL.Nat], [], ['oneway']),
    'http_request' : IDL.Func([HttpRequest], [HttpResponse], ['query']),
    'logo' : IDL.Func([], [LogoResult], ['query']),
    'mint' : IDL.Func(
        [IDL.Principal, MetadataDesc, IDL.Text],
        [MintReceipt],
        [],
      ),
    'name' : IDL.Func([], [IDL.Text], ['query']),
    'ownerOf' : IDL.Func([TokenId], [OwnerResult], ['query']),
    'publicMint' : IDL.Func([], [MintReceipt], []),
    'safeTransferFrom' : IDL.Func(
        [IDL.Principal, IDL.Principal, TokenId],
        [TxReceipt],
        [],
      ),
    'setMinter' : IDL.Func([IDL.Principal], [Result], []),
    'supportedInterfaces' : IDL.Func([], [IDL.Vec(InterfaceId)], ['query']),
    'symbol' : IDL.Func([], [IDL.Text], ['query']),
    'totalSupply' : IDL.Func([], [TokenId], ['query']),
    'transferFrom' : IDL.Func(
        [IDL.Principal, IDL.Principal, TokenId],
        [TxReceipt],
        [],
      ),
  });
};
export const init = ({ IDL }) => { return []; };
