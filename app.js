const contractAddress = 'YOUR_CONTRACT_ADDRESS_HERE';
const contractABI = [
    // Add your contract ABI here
];

let web3;
let contract;
let account;

document.getElementById('connectButton').addEventListener('click', connectMetaMask);

async function connectMetaMask() {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        try {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            const accounts = await web3.eth.getAccounts();
            account = accounts[0];
            document.getElementById('account').innerText = `Connected account: ${account}`;
            contract = new web3.eth.Contract(contractABI, contractAddress);
            checkEligibility();
            getDrawStats();
            getWinners();
        } catch (error) {
            console.error('User denied account access or error occurred');
        }
    } else {
        alert('MetaMask not detected!');
    }
}

async function checkEligibility() {
    const isEligible = await contract.methods.isEligibleForLottery(account).call();
    document.getElementById('eligibility').innerText = `Eligibility: ${isEligible ? 'Eligible' : 'Not Eligible'}`;
}

async function getDrawStats() {
    const pools = await contract.methods.getPools().call();
    document.getElementById('biWeeklyPool').innerText = web3.utils.fromWei(pools[0], 'ether') + ' PPL';
    document.getElementById('semiQuarterlyPool').innerText = web3.utils.fromWei(pools[1], 'ether') + ' PPL';
    document.getElementById('annualPool').innerText = web3.utils.fromWei(pools[2], 'ether') + ' PPL';

    const lastDistributions = await contract.methods.getLastDistributions().call();
    document.getElementById('lastBiWeekly').innerText = new Date(lastDistributions[0] * 1000).toLocaleString();
    document.getElementById('lastSemiQuarterly').innerText = new Date(lastDistributions[1] * 1000).toLocaleString();
    document.getElementById('lastAnnual').innerText = new Date(lastDistributions[2] * 1000).toLocaleString();
}

async function getWinners() {
    const lastBiWeeklyWinner = await contract.methods.getLastBiWeeklyWinner().call();
    const lastSemiQuarterlyWinner = await contract.methods.getLastSemiQuarterlyWinner().call();
    const lastAnnualWinner = await contract.methods.getLastAnnualWinner().call();

    document.getElementById('lastBiWeeklyWinner').innerText = lastBiWeeklyWinner;
    document.getElementById('lastSemiQuarterlyWinner').innerText = lastSemiQuarterlyWinner;
    document.getElementById('lastAnnualWinner').innerText = lastAnnualWinner;
}

window.addEventListener('load', () => {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
    } else {
        alert('MetaMask not detected!');
    }
});

