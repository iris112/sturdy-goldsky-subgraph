# POAP Subgraph

This Subgraph sources events from the Sturdy pair contract in different networks.

## Deploying the subgraph:

**First time only**
```ssh
yarn install
```

Available networks: linea

**Linea deployment**

Linea is not index by The Graph so we use Goldsky

```ssh
yarn prepare:linea
yarn codegen
yarn build

goldsky login
goldsky subgraph deploy sturdy-linea-silo/1.0.0 --path .
```