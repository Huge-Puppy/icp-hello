import type { Principal } from '@dfinity/principal';
export type ApiError = { 'ZeroAddress' : null } |
  { 'InvalidTokenId' : null } |
  { 'Unauthorized' : null } |
  { 'Other' : null };
export interface ExtendedMetadataResult {
  'token_id' : TokenId,
  'metadata_desc' : MetadataDesc,
}
export type HeaderField = [string, string];
export interface HttpRequest {
  'url' : string,
  'method' : string,
  'body' : Array<number>,
  'headers' : Array<HeaderField>,
}
export interface HttpResponse {
  'body' : Array<number>,
  'headers' : Array<HeaderField>,
  'status_code' : number,
}
export type InterfaceId = { 'Burn' : null } |
  { 'Mint' : null } |
  { 'Approval' : null } |
  { 'TransactionHistory' : null } |
  { 'TransferNotification' : null };
export interface LogoResult { 'data' : string, 'logo_type' : string }
export type MetadataDesc = Array<MetadataPart>;
export type MetadataKeyVal = [string, MetadataVal];
export interface MetadataPart {
  'data' : string,
  'key_val_data' : Array<MetadataKeyVal>,
  'purpose' : MetadataPurpose,
}
export type MetadataPurpose = { 'Preview' : null } |
  { 'Rendered' : null };
export type MetadataResult = { 'Ok' : MetadataDesc } |
  { 'Err' : ApiError };
export type MetadataVal = { 'Nat64Content' : bigint } |
  { 'Nat32Content' : number } |
  { 'Nat8Content' : number } |
  { 'NatContent' : bigint } |
  { 'Nat16Content' : number } |
  { 'BlobContent' : Array<number> } |
  { 'TextContent' : string };
export type MintReceipt = { 'Ok' : { 'id' : bigint, 'token_id' : TokenId } } |
  { 'Err' : { 'Unauthorized' : null } };
export type OwnerResult = { 'Ok' : Principal } |
  { 'Err' : ApiError };
export type Result = { 'ok' : null } |
  { 'err' : ApiError };
export type TokenId = bigint;
export type TxReceipt = { 'Ok' : bigint } |
  { 'Err' : ApiError };
export interface _SERVICE {
  'acceptCycles' : () => Promise<undefined>,
  'balance' : () => Promise<bigint>,
  'balanceOf' : (arg_0: Principal) => Promise<bigint>,
  'burn' : (arg_0: TokenId) => Promise<TxReceipt>,
  'getMetadata' : (arg_0: TokenId) => Promise<MetadataResult>,
  'getMetadataForUser' : (arg_0: Principal) => Promise<
      Array<ExtendedMetadataResult>
    >,
  'http_request' : (arg_0: HttpRequest) => Promise<HttpResponse>,
  'logo' : () => Promise<LogoResult>,
  'mint' : (arg_0: Principal, arg_1: MetadataDesc, arg_2: string) => Promise<
      MintReceipt
    >,
  'name' : () => Promise<string>,
  'ownerOf' : (arg_0: TokenId) => Promise<OwnerResult>,
  'publicMint' : () => Promise<MintReceipt>,
  'safeTransferFrom' : (
      arg_0: Principal,
      arg_1: Principal,
      arg_2: TokenId,
    ) => Promise<TxReceipt>,
  'setMinter' : (arg_0: Principal) => Promise<Result>,
  'supportedInterfaces' : () => Promise<Array<InterfaceId>>,
  'symbol' : () => Promise<string>,
  'totalSupply' : () => Promise<TokenId>,
  'transferFrom' : (
      arg_0: Principal,
      arg_1: Principal,
      arg_2: TokenId,
    ) => Promise<TxReceipt>,
}
