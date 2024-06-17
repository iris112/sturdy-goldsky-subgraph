import { Address } from "@graphprotocol/graph-ts";
import {
  Token,
  SturdyPair,
} from "../../generated/schema";
import {
    getERC20TokenContract,
  getSturdyPairContract,
} from "./contracts";

export function getOrInitToken(address: Address): Token {
  let tokenAddress = address.toHexString();
  let token = Token.load(tokenAddress);

  if (token == null) {
    token = new Token(tokenAddress);

    let erc20Token = getERC20TokenContract(address);

    let tokenDecimals = erc20Token.try_decimals();
    let tokenName = erc20Token.try_name();
    let tokenSymbol = erc20Token.try_symbol();

    token.decimals = !tokenDecimals.reverted ? tokenDecimals.value : 18;
    token.name = !tokenName.reverted ? tokenName.value : "";
    token.symbol = !tokenSymbol.reverted ? tokenSymbol.value : "";

    token.save();
  }

  return token as Token;
}


export function getOrInitSturdyPair(address: Address): SturdyPair {
  let pairAddress = address.toHexString();
  let pair = SturdyPair.load(pairAddress);
  if (pair == null) {
    pair = new SturdyPair(pairAddress);

    let pairContract = getSturdyPairContract(address);

    let assetAddress = pairContract.try_asset();
    let collateralAssetAddress = pairContract.try_collateralContract();
    let assetToken = getOrInitToken(assetAddress.value || Address.zero());
    let collateralAssetToken = getOrInitToken(collateralAssetAddress.value || Address.zero());

    pair.address = address;
    pair.asset = assetToken.id;
    pair.collateralAsset = (collateralAssetAddress.value || Address.zero()).toHexString();

    pair.save();
  }

  return pair;
}