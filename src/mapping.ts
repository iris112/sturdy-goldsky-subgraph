import {
  ethereum, BigInt
} from '@graphprotocol/graph-ts'

import {
  AddCollateral as AddCollateralEvent,
  RemoveCollateral as RemoveCollateralEvent,
  Deposit as DepositEvent,
  Withdraw as WithdrawEvent,
  BorrowAsset as BorrowEvent,
  RepayAsset as RepayEvent
} from '../generated/templates/SturdyPair/SturdyPairContract'

import { LogDeploy as LogDeployEvent} from '../generated/SturdyPairDeployer/SturdyPairDeployer';

import { SturdyPair as SturdyPairTemplate } from '../generated/templates';

import {
  User,
  AddCollateral,
  RemoveCollateral,
  Deposit,
  Withdraw,
  UserPair,
  Borrow,
  Repay
} from '../generated/schema'
import { getOrInitSturdyPair } from './helpers/initializer';
import { getSturdyPairContract } from './helpers/contracts';

function createID(event: ethereum.Event): string
{
  return event.block.number.toString().concat('-').concat(event.logIndex.toString());
}

function getUserPairID(user: string, pair: string): string
{
  return user.concat('-').concat(pair);
}

export function handleSturdyPairDeployed(event: LogDeployEvent): void {
  SturdyPairTemplate.create(event.params.address_);
}

export function handleAddCollateral(ev: AddCollateralEvent): void
{
  let addCollateral = new AddCollateral(createID(ev));
  let pair = getOrInitSturdyPair(ev.address)
  let sender = User.load(ev.params.sender.toHex().toLowerCase());
  let senderPair = UserPair.load(getUserPairID(ev.params.sender.toHex(), ev.address.toHex()));
  let borrower = User.load(ev.params.borrower.toHex().toLowerCase());
  let borrowerPair = UserPair.load(getUserPairID(ev.params.borrower.toHex(), ev.address.toHex()));
  
  if (sender == null) {
    sender = new User(ev.params.sender.toHex().toLowerCase());
    sender.address = ev.params.sender;
    sender.save();
  }

  if (senderPair == null) {
    senderPair = new UserPair(getUserPairID(ev.params.sender.toHex(), ev.address.toHex()))
    senderPair.user = sender.id;
    senderPair.pair = pair.id;
    senderPair.collateralAmount = BigInt.fromI32(0);
    senderPair.assetAmount = BigInt.fromI32(0);
    senderPair.shareAmount = BigInt.fromI32(0);
    senderPair.debtAssetAmount = BigInt.fromI32(0);
    senderPair.debtShareAmount = BigInt.fromI32(0);
    senderPair.save();
  }

  if (borrower == null) {
    borrower = new User(ev.params.borrower.toHex().toLowerCase());
    borrower.address = ev.params.borrower;
    borrower.save();
  }

  if (borrowerPair == null) {
    borrowerPair = new UserPair(getUserPairID(ev.params.borrower.toHex(), ev.address.toHex()))
    borrowerPair.user = borrower.id;
    borrowerPair.pair = pair.id;
    borrowerPair.collateralAmount = BigInt.fromI32(0);
    borrowerPair.assetAmount = BigInt.fromI32(0);
    borrowerPair.shareAmount = BigInt.fromI32(0);
    borrowerPair.debtAssetAmount = BigInt.fromI32(0);
    borrowerPair.debtShareAmount = BigInt.fromI32(0);
  }
  borrowerPair.collateralAmount = borrowerPair.collateralAmount.plus(ev.params.collateralAmount);
  borrowerPair.save();

  addCollateral.pair = pair.id;
  addCollateral.sender = sender.id;
  addCollateral.borrower = borrower.id;
  addCollateral.collateralAmount = ev.params.collateralAmount;
  addCollateral.transaction = ev.transaction.hash;
  addCollateral.timestamp = ev.block.timestamp;
  addCollateral.save();
}

export function handleRemoveCollateral(ev: RemoveCollateralEvent): void
{
  let removeCollateral = new RemoveCollateral(createID(ev));
  let pair = getOrInitSturdyPair(ev.address)
  let sender = User.load(ev.params._sender.toHex().toLowerCase());
  let senderPair = UserPair.load(getUserPairID(ev.params._sender.toHex(), ev.address.toHex()));
  let receiver = User.load(ev.params._receiver.toHex().toLowerCase());
  let receiverPair = UserPair.load(getUserPairID(ev.params._receiver.toHex(), ev.address.toHex()));
  let borrower = User.load(ev.params._borrower.toHex().toLowerCase());
  let borrowerPair = UserPair.load(getUserPairID(ev.params._borrower.toHex(), ev.address.toHex()));
  
  if (sender == null) {
    sender = new User(ev.params._sender.toHex().toLowerCase());
    sender.address = ev.params._sender;
    sender.save();
  }

  if (senderPair == null) {
    senderPair = new UserPair(getUserPairID(ev.params._sender.toHex(), ev.address.toHex()))
    senderPair.user = sender.id;
    senderPair.pair = pair.id;
    senderPair.collateralAmount = BigInt.fromI32(0);
    senderPair.assetAmount = BigInt.fromI32(0);
    senderPair.shareAmount = BigInt.fromI32(0);
    senderPair.debtAssetAmount = BigInt.fromI32(0);
    senderPair.debtShareAmount = BigInt.fromI32(0);
    senderPair.save();
  }

  if (receiver == null) {
    receiver = new User(ev.params._receiver.toHex().toLowerCase());
    receiver.address = ev.params._receiver;
    receiver.save();
  }

  if (receiverPair == null) {
    receiverPair = new UserPair(getUserPairID(ev.params._receiver.toHex(), ev.address.toHex()))
    receiverPair.user = receiver.id;
    receiverPair.pair = pair.id;
    receiverPair.collateralAmount = BigInt.fromI32(0);
    receiverPair.assetAmount = BigInt.fromI32(0);
    receiverPair.shareAmount = BigInt.fromI32(0);
    receiverPair.debtAssetAmount = BigInt.fromI32(0);
    receiverPair.debtShareAmount = BigInt.fromI32(0);
    receiverPair.save();
  }

  if (borrower == null) {
    borrower = new User(ev.params._borrower.toHex().toLowerCase());
    borrower.address = ev.params._borrower;
    borrower.save();
  }

  if (borrowerPair == null) {
    borrowerPair = new UserPair(getUserPairID(ev.params._borrower.toHex(), ev.address.toHex()))
    borrowerPair.user = borrower.id;
    borrowerPair.pair = pair.id;
    borrowerPair.collateralAmount = BigInt.fromI32(0);
    borrowerPair.assetAmount = BigInt.fromI32(0);
    borrowerPair.shareAmount = BigInt.fromI32(0);
    borrowerPair.debtAssetAmount = BigInt.fromI32(0);
    borrowerPair.debtShareAmount = BigInt.fromI32(0);
  }
  borrowerPair.collateralAmount = borrowerPair.collateralAmount.minus(ev.params._collateralAmount);
  borrowerPair.save();

  removeCollateral.pair = pair.id;
  removeCollateral.sender = sender.id;
  removeCollateral.receiver = receiver.id;
  removeCollateral.borrower = borrower.id;
  removeCollateral.collateralAmount = ev.params._collateralAmount;
  removeCollateral.transaction = ev.transaction.hash;
  removeCollateral.timestamp = ev.block.timestamp;
  removeCollateral.save();
}

export function handleDeposit(ev: DepositEvent): void
{
  let deposit = new Deposit(createID(ev));
  let pair = getOrInitSturdyPair(ev.address)
  let caller = User.load(ev.params.caller.toHex().toLowerCase());
  let callerPair = UserPair.load(getUserPairID(ev.params.caller.toHex(), ev.address.toHex()));
  let owner = User.load(ev.params.owner.toHex().toLowerCase());
  let ownerPair = UserPair.load(getUserPairID(ev.params.owner.toHex(), ev.address.toHex()));
  
  if (caller == null) {
    caller = new User(ev.params.caller.toHex().toLowerCase());
    caller.address = ev.params.caller;
    caller.save();
  }

  if (callerPair == null) {
    callerPair = new UserPair(getUserPairID(ev.params.caller.toHex(), ev.address.toHex()))
    callerPair.user = caller.id;
    callerPair.pair = pair.id;
    callerPair.collateralAmount = BigInt.fromI32(0);
    callerPair.assetAmount = BigInt.fromI32(0);
    callerPair.shareAmount = BigInt.fromI32(0);
    callerPair.debtAssetAmount = BigInt.fromI32(0);
    callerPair.debtShareAmount = BigInt.fromI32(0);
    callerPair.save();
  }

  if (owner == null) {
    owner = new User(ev.params.owner.toHex().toLowerCase());
    owner.address = ev.params.owner;
    owner.save();
  }

  if (ownerPair == null) {
    ownerPair = new UserPair(getUserPairID(ev.params.owner.toHex(), ev.address.toHex()))
    ownerPair.user = owner.id;
    ownerPair.pair = pair.id;
    ownerPair.collateralAmount = BigInt.fromI32(0);
    ownerPair.assetAmount = BigInt.fromI32(0);
    ownerPair.shareAmount = BigInt.fromI32(0);
    ownerPair.debtAssetAmount = BigInt.fromI32(0);
    ownerPair.debtShareAmount = BigInt.fromI32(0);
  }
  ownerPair.shareAmount = ownerPair.shareAmount.plus(ev.params.shares);
  ownerPair.assetAmount = getSturdyPairContract(ev.address).try_convertToAssets(ownerPair.shareAmount).value;
  ownerPair.save();

  deposit.pair = pair.id;
  deposit.caller = caller.id;
  deposit.owner = owner.id;
  deposit.assetAmount = ev.params.assets;
  deposit.shareAmount = ev.params.shares;
  deposit.transaction = ev.transaction.hash;
  deposit.timestamp = ev.block.timestamp;
  deposit.save();
}

export function handleWithdraw(ev: WithdrawEvent): void
{
  let withdraw = new Withdraw(createID(ev));
  let pair = getOrInitSturdyPair(ev.address)
  let caller = User.load(ev.params.caller.toHex().toLowerCase());
  let callerPair = UserPair.load(getUserPairID(ev.params.caller.toHex(), ev.address.toHex()));
  let receiver = User.load(ev.params.receiver.toHex().toLowerCase());
  let receiverPair = UserPair.load(getUserPairID(ev.params.receiver.toHex(), ev.address.toHex()));
  let owner = User.load(ev.params.owner.toHex().toLowerCase());
  let ownerPair = UserPair.load(getUserPairID(ev.params.owner.toHex(), ev.address.toHex()));
  
  if (caller == null) {
    caller = new User(ev.params.caller.toHex().toLowerCase());
    caller.address = ev.params.caller;
    caller.save();
  }

  if (callerPair == null) {
    callerPair = new UserPair(getUserPairID(ev.params.caller.toHex(), ev.address.toHex()))
    callerPair.user = caller.id;
    callerPair.pair = pair.id;
    callerPair.collateralAmount = BigInt.fromI32(0);
    callerPair.assetAmount = BigInt.fromI32(0);
    callerPair.shareAmount = BigInt.fromI32(0);
    callerPair.debtAssetAmount = BigInt.fromI32(0);
    callerPair.debtShareAmount = BigInt.fromI32(0);
    callerPair.save();
  }

  if (receiver == null) {
    receiver = new User(ev.params.receiver.toHex().toLowerCase());
    receiver.address = ev.params.receiver;
    receiver.save();
  }

  if (receiverPair == null) {
    receiverPair = new UserPair(getUserPairID(ev.params.receiver.toHex(), ev.address.toHex()))
    receiverPair.user = receiver.id;
    receiverPair.pair = pair.id;
    receiverPair.collateralAmount = BigInt.fromI32(0);
    receiverPair.assetAmount = BigInt.fromI32(0);
    receiverPair.shareAmount = BigInt.fromI32(0);
    receiverPair.debtAssetAmount = BigInt.fromI32(0);
    receiverPair.debtShareAmount = BigInt.fromI32(0);
    receiverPair.save();
  }

  if (owner == null) {
    owner = new User(ev.params.owner.toHex().toLowerCase());
    owner.address = ev.params.owner;
    owner.save();
  }

  if (ownerPair == null) {
    ownerPair = new UserPair(getUserPairID(ev.params.owner.toHex(), ev.address.toHex()))
    ownerPair.user = owner.id;
    ownerPair.pair = pair.id;
    ownerPair.collateralAmount = BigInt.fromI32(0);
    ownerPair.assetAmount = BigInt.fromI32(0);
    ownerPair.shareAmount = BigInt.fromI32(0);
    ownerPair.debtAssetAmount = BigInt.fromI32(0);
    ownerPair.debtShareAmount = BigInt.fromI32(0);
  }
  ownerPair.shareAmount = ownerPair.shareAmount.minus(ev.params.shares);
  ownerPair.assetAmount = getSturdyPairContract(ev.address).try_convertToAssets(ownerPair.shareAmount).value;
  ownerPair.save();

  withdraw.pair = pair.id;
  withdraw.caller = caller.id;
  withdraw.receiver = receiver.id;
  withdraw.owner = owner.id;
  withdraw.assetAmount = ev.params.assets;
  withdraw.shareAmount = ev.params.shares;
  withdraw.transaction = ev.transaction.hash;
  withdraw.timestamp = ev.block.timestamp;
  withdraw.save();
}

export function handleBorrow(ev: BorrowEvent): void
{
  let borrow = new Borrow(createID(ev));
  let pair = getOrInitSturdyPair(ev.address)
  let borrower = User.load(ev.params._borrower.toHex().toLowerCase());
  let borrowerPair = UserPair.load(getUserPairID(ev.params._borrower.toHex(), ev.address.toHex()));
  let receiver = User.load(ev.params._receiver.toHex().toLowerCase());
  let receiverPair = UserPair.load(getUserPairID(ev.params._receiver.toHex(), ev.address.toHex()));
  
  if (receiver == null) {
    receiver = new User(ev.params._receiver.toHex().toLowerCase());
    receiver.address = ev.params._receiver;
    receiver.save();
  }

  if (receiverPair == null) {
    receiverPair = new UserPair(getUserPairID(ev.params._receiver.toHex(), ev.address.toHex()))
    receiverPair.user = receiver.id;
    receiverPair.pair = pair.id;
    receiverPair.collateralAmount = BigInt.fromI32(0);
    receiverPair.assetAmount = BigInt.fromI32(0);
    receiverPair.shareAmount = BigInt.fromI32(0);
    receiverPair.debtAssetAmount = BigInt.fromI32(0);
    receiverPair.debtShareAmount = BigInt.fromI32(0);
    receiverPair.save();
  }

  if (borrower == null) {
    borrower = new User(ev.params._borrower.toHex().toLowerCase());
    borrower.address = ev.params._borrower;
    borrower.save();
  }

  if (borrowerPair == null) {
    borrowerPair = new UserPair(getUserPairID(ev.params._borrower.toHex(), ev.address.toHex()))
    borrowerPair.user = borrower.id;
    borrowerPair.pair = pair.id;
    borrowerPair.collateralAmount = BigInt.fromI32(0);
    borrowerPair.assetAmount = BigInt.fromI32(0);
    borrowerPair.shareAmount = BigInt.fromI32(0);
    borrowerPair.debtAssetAmount = BigInt.fromI32(0);
    borrowerPair.debtShareAmount = BigInt.fromI32(0);
  }
  borrowerPair.debtShareAmount = borrowerPair.debtShareAmount.plus(ev.params._sharesAdded);
  borrowerPair.debtAssetAmount = getSturdyPairContract(ev.address).try_toBorrowAmount(borrowerPair.debtShareAmount, true, true).value;
  borrowerPair.save();

  borrow.pair = pair.id;
  borrow.borrower = borrower.id;
  borrow.receiver = receiver.id;
  borrow.borrowAmount = ev.params._borrowAmount;
  borrow.shareAmount = ev.params._sharesAdded;
  borrow.transaction = ev.transaction.hash;
  borrow.timestamp = ev.block.timestamp;
  borrow.save();
}

export function handleRepay(ev: RepayEvent): void
{
  let repay = new Repay(createID(ev));
  let pair = getOrInitSturdyPair(ev.address)
  let borrower = User.load(ev.params.borrower.toHex().toLowerCase());
  let borrowerPair = UserPair.load(getUserPairID(ev.params.borrower.toHex(), ev.address.toHex()));
  let payer = User.load(ev.params.payer.toHex().toLowerCase());
  let payerPair = UserPair.load(getUserPairID(ev.params.payer.toHex(), ev.address.toHex()));
  
  if (payer == null) {
    payer = new User(ev.params.payer.toHex().toLowerCase());
    payer.address = ev.params.payer;
    payer.save();
  }

  if (payerPair == null) {
    payerPair = new UserPair(getUserPairID(ev.params.payer.toHex(), ev.address.toHex()))
    payerPair.user = payer.id;
    payerPair.pair = pair.id;
    payerPair.collateralAmount = BigInt.fromI32(0);
    payerPair.assetAmount = BigInt.fromI32(0);
    payerPair.shareAmount = BigInt.fromI32(0);
    payerPair.debtAssetAmount = BigInt.fromI32(0);
    payerPair.debtShareAmount = BigInt.fromI32(0);
    payerPair.save();
  }

  if (borrower == null) {
    borrower = new User(ev.params.borrower.toHex().toLowerCase());
    borrower.address = ev.params.borrower;
    borrower.save();
  }

  if (borrowerPair == null) {
    borrowerPair = new UserPair(getUserPairID(ev.params.borrower.toHex(), ev.address.toHex()))
    borrowerPair.user = borrower.id;
    borrowerPair.pair = pair.id;
    borrowerPair.collateralAmount = BigInt.fromI32(0);
    borrowerPair.assetAmount = BigInt.fromI32(0);
    borrowerPair.shareAmount = BigInt.fromI32(0);
    borrowerPair.debtAssetAmount = BigInt.fromI32(0);
    borrowerPair.debtShareAmount = BigInt.fromI32(0);
  }
  borrowerPair.debtShareAmount = borrowerPair.debtShareAmount.minus(ev.params.shares);
  borrowerPair.debtAssetAmount = getSturdyPairContract(ev.address).try_toBorrowAmount(borrowerPair.debtShareAmount, true, true).value;
  borrowerPair.save();

  repay.pair = pair.id;
  repay.borrower = borrower.id;
  repay.payer = payer.id;
  repay.assetAmount = ev.params.amountToRepay;
  repay.shareAmount = ev.params.shares;
  repay.transaction = ev.transaction.hash;
  repay.timestamp = ev.block.timestamp;
  repay.save();
}