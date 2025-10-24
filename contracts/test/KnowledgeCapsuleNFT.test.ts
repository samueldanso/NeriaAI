import { test, describe } from 'node:test'
import { expect } from 'chai'
import hre from 'hardhat'

describe('KnowledgeCapsuleNFT', function () {
	test('Should deploy and have correct name and symbol', async function () {
		const connection = await hre.network.connect()
		const knowledgeCapsuleNFT = await connection.viem.deployContract('KnowledgeCapsuleNFT')

		const name = await knowledgeCapsuleNFT.read.name()
		const symbol = await knowledgeCapsuleNFT.read.symbol()

		expect(name).to.equal('NeriaKnowledgeCapsule')
		expect(symbol).to.equal('NERIA')
	})

	test('Should mint a new capsule NFT', async function () {
		const connection = await hre.network.connect()
		const [owner] = await connection.viem.getWalletClients()
		const knowledgeCapsuleNFT = await connection.viem.deployContract('KnowledgeCapsuleNFT')

		const ipfsHash = 'QmTestHash123'
		await knowledgeCapsuleNFT.write.mintCapsule([ipfsHash])

		// Check that token 1 was minted
		const ownerOf = await knowledgeCapsuleNFT.read.ownerOf([1n])
		expect(ownerOf.toLowerCase()).to.equal(owner.account.address.toLowerCase())

		// Check total supply
		const totalSupply = await knowledgeCapsuleNFT.read.totalSupply()
		expect(totalSupply).to.equal(1n)
	})

	test('Should retrieve capsule data', async function () {
		const connection = await hre.network.connect()
		const [owner] = await connection.viem.getWalletClients()
		const knowledgeCapsuleNFT = await connection.viem.deployContract('KnowledgeCapsuleNFT')

		const ipfsHash = 'QmTestHash123'
		await knowledgeCapsuleNFT.write.mintCapsule([ipfsHash])

		const capsuleData = await knowledgeCapsuleNFT.read.getCapsuleData([1n])

		expect(capsuleData.ipfsHash).to.equal(ipfsHash)
		expect(capsuleData.creator.toLowerCase()).to.equal(owner.account.address.toLowerCase())
		expect(capsuleData.verified).to.equal(false)
	})
})
