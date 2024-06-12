import {
  ethereum, BigInt
} from '@graphprotocol/graph-ts'

import {
  AddCollateral as AddCollateralEvent,
  RemoveCollateral as RemoveCollateralEvent,
  Deposit as DepositEvent,
  Withdraw as WithdrawEvent,
} from '../generated/SturdyPair/Pair'

import {
  User,
  AddCollateral,
  RemoveCollateral,
  Deposit,
  Withdraw
} from '../generated/schema'

function createID(event: ethereum.Event): string
{
  return event.block.number.toString().concat('-').concat(event.logIndex.toString());
}

export function handleAddCollateral(ev: AddCollateralEvent): void
{
  let addCollateral = new AddCollateral(createID(ev));
  let sender = User.load(ev.params.sender.toHex());
  let borrower = User.load(ev.params.borrower.toHex());
  
  if (sender == null) {
    sender = new User(ev.params.sender.toHex());
    sender.collateralAmount = BigInt.fromI32(0);
    sender.shareAmount = BigInt.fromI32(0);
    sender.save();
  }

  if (borrower == null) {
    borrower = new User(ev.params.borrower.toHex());
    borrower.collateralAmount = BigInt.fromI32(0);
    borrower.shareAmount = BigInt.fromI32(0);
  }
  borrower.collateralAmount = borrower.collateralAmount.plus(ev.params.collateralAmount);
  borrower.save();

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
  let sender = User.load(ev.params._sender.toHex());
  let receiver = User.load(ev.params._receiver.toHex());
  let borrower = User.load(ev.params._borrower.toHex());
  
  if (sender == null) {
    sender = new User(ev.params._sender.toHex());
    sender.collateralAmount = BigInt.fromI32(0);
    sender.shareAmount = BigInt.fromI32(0);
    sender.save();
  }

  if (receiver == null) {
    receiver = new User(ev.params._receiver.toHex());
    receiver.collateralAmount = BigInt.fromI32(0);
    receiver.shareAmount = BigInt.fromI32(0);
    receiver.save();
  }

  if (borrower == null) {
    borrower = new User(ev.params._borrower.toHex());
    borrower.collateralAmount = BigInt.fromI32(0);
    borrower.shareAmount = BigInt.fromI32(0);
  }
  borrower.collateralAmount = borrower.collateralAmount.minus(ev.params._collateralAmount);
  borrower.save();

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
  let caller = User.load(ev.params.caller.toHex());
  let owner = User.load(ev.params.owner.toHex());
  
  if (caller == null) {
    caller = new User(ev.params.caller.toHex());
    caller.collateralAmount = BigInt.fromI32(0);
    caller.shareAmount = BigInt.fromI32(0);
    caller.save();
  }

  if (owner == null) {
    owner = new User(ev.params.owner.toHex());
    owner.collateralAmount = BigInt.fromI32(0);
    owner.shareAmount = BigInt.fromI32(0);
    owner.save();
  }
  owner.shareAmount = owner.shareAmount.plus(ev.params.shares);
  owner.save();

  deposit.caller = caller.id;
  deposit.owner = owner.id;
  deposit.shareAmount = ev.params.assets;
  deposit.shareAmount = ev.params.shares;
  deposit.transaction = ev.transaction.hash;
  deposit.timestamp = ev.block.timestamp;
  deposit.save();
}

export function handleWithdraw(ev: WithdrawEvent): void
{
  let withdraw = new Withdraw(createID(ev));
  let caller = User.load(ev.params.caller.toHex());
  let receiver = User.load(ev.params.receiver.toHex());
  let owner = User.load(ev.params.owner.toHex());
  
  if (caller == null) {
    caller = new User(ev.params.caller.toHex());
    caller.collateralAmount = BigInt.fromI32(0);
    caller.shareAmount = BigInt.fromI32(0);
    caller.save();
  }

  if (receiver == null) {
    receiver = new User(ev.params.receiver.toHex());
    receiver.collateralAmount = BigInt.fromI32(0);
    receiver.shareAmount = BigInt.fromI32(0);
    receiver.save();
  }

  if (owner == null) {
    owner = new User(ev.params.owner.toHex());
    owner.collateralAmount = BigInt.fromI32(0);
    owner.shareAmount = BigInt.fromI32(0);
    owner.save();
  }
  owner.shareAmount = owner.shareAmount.minus(ev.params.shares);
  owner.save();

  withdraw.caller = caller.id;
  withdraw.receiver = receiver.id;
  withdraw.owner = owner.id;
  withdraw.assetAmount = ev.params.assets;
  withdraw.shareAmount = ev.params.shares;
  withdraw.transaction = ev.transaction.hash;
  withdraw.timestamp = ev.block.timestamp;
  withdraw.save();
}