import { Address } from "@graphprotocol/graph-ts";
import { SturdyPairContract } from '../../generated/templates/SturdyPair/SturdyPairContract'
import { ERC20 } from "../../generated/templates/SturdyPair/ERC20"

export function getERC20TokenContract(address: Address): ERC20 {
  return ERC20.bind(address);
}

export function getSturdyPairContract(address: Address): SturdyPairContract {
  return SturdyPairContract.bind(address);
}