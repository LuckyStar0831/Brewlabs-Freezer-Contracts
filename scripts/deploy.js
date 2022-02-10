require('dotenv').config()
const hre = require('hardhat')

const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay * 1000));

async function main() {
  const ethers = hre.ethers
  console.log('network', await ethers.provider.getNetwork())
  
  const signer = (await ethers.getSigners())[0]
  console.log('signer address:', await signer.getAddress())

  const _uniswapFactory = ''
  if(!ethers.utils.isAddress(_uniswapFactory)) {
    console.log('Invalid address')
    return
  }
  
  console.log('Starting deployments...')
  const LiquidityLockerContract = await ethers.getContractFactory('LiquidityLocker', {
    signer: (await ethers.getSigners())[0]
  })

  const liquidityLockerContract = await LiquidityLockerContract.deploy()
  await liquidityLockerContract.deployed()
  console.log('LiquidityLocker contract deployed to:', liquidityLockerContract.address)

  await sleep(600);
  await hre.run("verify:verify", {
    address: liquidityLockerContract.address,
    constructorArguments: [_uniswapFactory],
  })

  console.log('LiquidityLocker contract verified')    
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
