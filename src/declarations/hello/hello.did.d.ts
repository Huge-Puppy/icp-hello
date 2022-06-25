import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

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
  'acceptCycles' : ActorMethod<[], undefined>,
  'balance' : ActorMethod<[], bigint>,
  'balanceOf' : ActorMethod<[Principal], bigint>,
  'burn' : ActorMethod<[TokenId], TxReceipt>,
  'getMetadata' : ActorMethod<[TokenId], MetadataResult>,
  'getMetadataForUser' : ActorMethod<
    [Principal],
    Array<ExtendedMetadataResult>,
  >,
  'giveGold' : ActorMethod<[bigint], undefined>,
  'http_request' : ActorMethod<[HttpRequest], HttpResponse>,
  'logo' : ActorMethod<[], LogoResult>,
  'mint' : ActorMethod<[Principal, MetadataDesc, string], MintReceipt>,
  'name' : ActorMethod<[], string>,
  'ownerOf' : ActorMethod<[TokenId], OwnerResult>,
  'publicMint' : ActorMethod<[], MintReceipt>,
  'safeTransferFrom' : ActorMethod<[Principal, Principal, TokenId], TxReceipt>,
  'setMinter' : ActorMethod<[Principal], Result>,
  'supportedInterfaces' : ActorMethod<[], Array<InterfaceId>>,
  'symbol' : ActorMethod<[], string>,
  'totalSupply' : ActorMethod<[], TokenId>,
  'transferFrom' : ActorMethod<[Principal, Principal, TokenId], TxReceipt>,
}
