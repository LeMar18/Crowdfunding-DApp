import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import web3 from './web3';
import lottery from './crowdfunding';


class App extends Component {
  state = {
    currAddress: '',
    ownerAddress: '',
    balance: '0',
    collectedFees: '0',
    message: '',
    currentAccount: '',
    activeCampaignids: [],
    activeCampaigntitles: [],
    activeCampaignentrep: [],
    activecampaignPrice:[],
    activecampaignBackers:[],
    activecampaignPledgesLeft:[],
    activecampaignYourPledges:[],
    activeCampaignisEntrep:[],
    activeCampaignIsFulfilled:[],

    cancCampaignids: [],
    cancCampaigntitles: [],
    cancCampaignentrep: [],
    canccampaignPrice:[],
    canccampaignBackers:[],
    canccampaignPledgesLeft:[],
    canccampaignYourPledges:[],

    fulCampaignids: [],
    fulCampaigntitles: [],
    fulCampaignentrep: [],
    fulcampaignPrice:[],
    fulcampaignBackers:[],
    fulcampaignPledgesLeft:[],
    fulcampaignYourPledges:[],


    fulfilledCampaigns: []
  };

  async componentDidMount() {

    await window.ethereum.request({ method: 'eth_requestAccounts' });

      // Φέρε τη διεύθυνση του ιδιοκτήτη
      const ownerAddress = await lottery.methods.owner().call();
      const balance =await lottery.methods.getContractBalance().call();
      const balanceInEther = web3.utils.fromWei(balance.toString(), 'ether');
      this.setState({ balance: balanceInEther });

      const fees =await lottery.methods.totalFees().call();
      const feesInEther = web3.utils.fromWei(balance.toString(), 'ether');
      this.setState({ collectedFees: feesInEther });
      

      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      const currAddress = accounts[0];
      
      

      
      this.setState({currAddress,ownerAddress});

      let data = await lottery.methods.getActiveCampaignsSummary().call();
    let campaignIds = data[0]; // uint[] (π.χ. IDs campaigns)
    let titles = data[1]; // string[] (π.χ. τίτλοι campaigns)
    let entrepreneurs = data[2]; // address[] (π.χ. διευθύνσεις entrepreneurs)
    let price=data[3];
    let backers=data[4];
    let plleft=data[5];
    let ypledges= await lottery.methods.getYourActivePledges(currAddress).call();
    //let isEntrep = await lottery.methods.isEntrepreneur(currAddress).call();
   // let isful= await lottery.methods.isFulfilled().call();
   // console.log(isful);
    this.setState({
      activeCampaignids: campaignIds.map(id=>id.toString()),
      activeCampaigntitles: titles,
      activeCampaignentrep: entrepreneurs,
      activecampaignPrice:price,
      activecampaignBackers:backers,
      activecampaignPledgesLeft:plleft,
      activecampaignYourPledges:ypledges,
     // activeCampaignisEntrep:isEntrep,
      //activeCampaignIsFulfilled:isful

    });
    

    data= await lottery.methods.getCancelledCampaigns().call();
     campaignIds = data[0]; // uint[] (π.χ. IDs campaigns)
     titles = data[1]; // string[] (π.χ. τίτλοι campaigns)
     entrepreneurs = data[2]; // address[] (π.χ. διευθύνσεις entrepreneurs)
     price=data[3];
     backers=data[4];
     plleft=data[5];
     ypledges= await lottery.methods.getYourCancelledPledges(currAddress).call();
    this.setState({
      cancCampaignids: campaignIds.map(id=>id.toString()),
      cancCampaigntitles: titles,
      cancCampaignentrep: entrepreneurs,
      canccampaignPrice:price,
      canccampaignBackers:backers,
      canccampaignPledgesLeft:plleft,
      canccampaignYourPledges:ypledges

    });

    data= await lottery.methods.getFulfilledCampaignDetails().call();
     campaignIds = data[0]; // uint[] (π.χ. IDs campaigns)
     titles = data[1]; // string[] (π.χ. τίτλοι campaigns)
     entrepreneurs = data[2]; // address[] (π.χ. διευθύνσεις entrepreneurs)
     price=data[3];
     backers=data[4];
     plleft=data[5];
     ypledges= await lottery.methods.getYourFulfilledPledges(currAddress).call();
    this.setState({
      fulCampaignids: campaignIds.map(id=>id.toString()),
      fulCampaigntitles: titles,
      fulCampaignentrep: entrepreneurs,
      fulcampaignPrice:price,
      fulcampaignBackers:backers,
      fulcampaignPledgesLeft:plleft,
      fulcampaignYourPledges:ypledges

    });
      




   
  }

  onCreate = async event => {
    try{
    event.preventDefault();
    const title = document.getElementById("title").value;
    const pledgeCost = document.getElementById("pledgeCost").value;
    const numberOfPledges = document.getElementById("numberOfPledges").value;
   

    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
    const sender = accounts[0];
    const campaignFee = web3.utils.toWei("0.02", "ether");

    await lottery.methods.createCampaign(title, pledgeCost, numberOfPledges).send({
      from: sender,
      value: campaignFee, // Το msg.value της συναλλαγής
    });

    const balance =await lottery.methods.getContractBalance().call();
    const balanceInEther = web3.utils.fromWei(balance.toString(), 'ether');
    this.setState({ balance: balanceInEther });

    const fees =await lottery.methods.totalFees().call();
    const feesInEther = web3.utils.fromWei(balance.toString(), 'ether');
    this.setState({ collectedFees: feesInEther });
    
    const data = await lottery.methods.getActiveCampaignsSummary().call();
    const campaignIds = data[0]; // uint[] (π.χ. IDs campaigns)
    const titles = data[1]; // string[] (π.χ. τίτλοι campaigns)
    const entrepreneurs = data[2]; // address[] (π.χ. διευθύνσεις entrepreneurs)
    const price=data[3];
    const backers=data[4];
    const plleft=data[5];
    const ypledges=await lottery.methods.getYourActivePledges(sender).call();
   // let isEntrep = await lottery.methods.isEntrepreneur(sender).call();
  // let isful= await lottery.methods.isFulfilled().call();
    this.setState({
      activeCampaignids: campaignIds.map(id=>id.toString()),
      activeCampaigntitles: titles,
      activeCampaignentrep: entrepreneurs,
      activecampaignPrice:price,
      activecampaignBackers:backers,
      activecampaignPledgesLeft:plleft,
      activecampaignYourPledges:ypledges,
     // activeCampaignisEntrep:isEntrep,
     // activeCampaignIsFulfilled:isful

    });
  }
  catch (error) {
    console.error("Error creating campaign:", error);
    alert("Failed to create the campaign. Check console for details.");
  }


    
    };

    
    onCancel = async (id) => {
      try {
        console.log("Canceling campaign with ID:", typeof id);
    
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        const account = accounts[0];
    
        // Ακύρωση της καμπάνιας
        await lottery.methods.cancelCampaign(parseInt(id)).send({
          from: account,
        });
    
        alert(`Campaign with ID ${id} has been successfully canceled.`);
    
        // Ενημέρωσε τα δεδομένα
        let data = await lottery.methods.getActiveCampaignsSummary().call();
        let campaignIds = data[0];
        let titles = data[1];
        let entrepreneurs = data[2];
        let price = data[3];
        let backers = data[4];
        let plleft = data[5];
        let ypledges = await lottery.methods.getYourActivePledges(account).call();
       // let isEntrep = await lottery.methods.isEntrepreneur(account).call();
       // let isful= await lottery.methods.isFulfilled().call();
        this.setState({
          activeCampaignids: campaignIds.map((id) => id.toString()),
          activeCampaigntitles: titles,
          activeCampaignentrep: entrepreneurs,
          activecampaignPrice: price,
          activecampaignBackers: backers,
          activecampaignPledgesLeft: plleft,
          activecampaignYourPledges: ypledges,
         // activeCampaignisEntrep: isEntrep,
          //activeCampaignIsFulfilled:isful
        });
    
        data = await lottery.methods.getCancelledCampaigns().call();
        campaignIds = data[0];
        titles = data[1];
        entrepreneurs = data[2];
        price = data[3];
        backers = data[4];
        plleft = data[5];
        ypledges = await lottery.methods.getYourCancelledPledges(account).call();
        this.setState({
          cancCampaignids: campaignIds.map((id) => id.toString()),
          cancCampaigntitles: titles,
          cancCampaignentrep: entrepreneurs,
          canccampaignPrice: price,
          canccampaignBackers: backers,
          canccampaignPledgesLeft: plleft,
          canccampaignYourPledges: ypledges,
        });

        const balance =await lottery.methods.getContractBalance().call();
      const balanceInEther = web3.utils.fromWei(balance.toString(), 'ether');
      this.setState({ balance: balanceInEther });

      const fees =await lottery.methods.totalFees().call();
      const feesInEther = web3.utils.fromWei(balance.toString(), 'ether');
      this.setState({ collectedFees: feesInEther });

      } catch (error) {
        console.error("Error canceling campaign:", error);
        alert("Failed to cancel the campaign. Check console for details.");
      }
    };

    onPledge = async (id,price) => {

      try {
          console.log("PLEDGE THE CAMPAIGN WITH ID",id);
          const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
          const account = accounts[0];
          await lottery.methods.fundCampaign(parseInt(id),1).send({
            from:account,
            value: parseInt(price)
          });

          let data = await lottery.methods.getActiveCampaignsSummary().call();
          let campaignIds = data[0];
          let titles = data[1];
          let entrepreneurs = data[2];
          let pricee = data[3];
          let backers = data[4];
          let plleft = data[5];
          let ypledges = await lottery.methods.getYourActivePledges(account).call();
         // let isEntrep = await lottery.methods.isEntrepreneur(account).call();
          //let isful= await lottery.methods.isFulfilled().call();
          this.setState({
            activeCampaignids: campaignIds.map((id) => id.toString()),
            activeCampaigntitles: titles,
            activeCampaignentrep: entrepreneurs,
            activecampaignPrice: pricee,
            activecampaignBackers: backers,
            activecampaignPledgesLeft: plleft,
            activecampaignYourPledges: ypledges,
           // activeCampaignisEntrep: isEntrep,
           // activeCampaignIsFulfilled:isful
          });

          const balance =await lottery.methods.getContractBalance().call();
      const balanceInEther = web3.utils.fromWei(balance.toString(), 'ether');
      this.setState({ balance: balanceInEther });

      const fees =await lottery.methods.totalFees().call();
      const feesInEther = web3.utils.fromWei(balance.toString(), 'ether');
      this.setState({ collectedFees: feesInEther });



      }
      catch (error) {
        console.error("Error in onPledge:", error);
        alert(`Failed to pledge. Error: ${error.message}`);
        console.log(price);
      }

    };


    onFulfill = async (id) => {
      try {
        console.log("Fulfill campaign with id",id);
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
          const account = accounts[0];

          await lottery.methods.completeCampaign(id).send({ from: account });

          let data = await lottery.methods.getActiveCampaignsSummary().call();
          let campaignIds = data[0];
          let titles = data[1];
          let entrepreneurs = data[2];
          let price = data[3];
          let backers = data[4];
          let plleft = data[5];
          let ypledges = await lottery.methods.getYourActivePledges(account).call();
         // let isEntrep = await lottery.methods.isEntrepreneur(account).call();
         // let isful= await lottery.methods.isFulfilled().call();
          this.setState({
            activeCampaignids: campaignIds.map((id) => id.toString()),
            activeCampaigntitles: titles,
            activeCampaignentrep: entrepreneurs,
            activecampaignPrice: price,
            activecampaignBackers: backers,
            activecampaignPledgesLeft: plleft,
            activecampaignYourPledges: ypledges,
           // activeCampaignisEntrep: isEntrep,
           // activeCampaignIsFulfilled:isful
          });


          data= await lottery.methods.getFulfilledCampaignDetails().call();
     campaignIds = data[0]; // uint[] (π.χ. IDs campaigns)
     titles = data[1]; // string[] (π.χ. τίτλοι campaigns)
     entrepreneurs = data[2]; // address[] (π.χ. διευθύνσεις entrepreneurs)
     price=data[3];
     backers=data[4];
     plleft=data[5];
     ypledges=await lottery.methods.getYourFulfilledPledges(account).call();
    this.setState({
      fulCampaignids: campaignIds.map(id=>id.toString()),
      fulCampaigntitles: titles,
      fulCampaignentrep: entrepreneurs,
      fulcampaignPrice:price,
      fulcampaignBackers:backers,
      fulcampaignPledgesLeft:plleft,
      fulcampaignYourPledges:ypledges

    });

    const balance =await lottery.methods.getContractBalance().call();
      const balanceInEther = web3.utils.fromWei(balance.toString(), 'ether');
      this.setState({ balance: balanceInEther });

      const fees =await lottery.methods.totalFees().call();
      const feesInEther = web3.utils.fromWei(balance.toString(), 'ether');
      this.setState({ collectedFees: feesInEther });


      }
      catch (error) {
        console.error("Error in onFulfill:", error);
        alert(`Failed to FulFill. Error: ${error.message}`);
      }


    };

    onClaim = async () => 
      {
        try {

          console.log("Claim from canceled campaigns");
          const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
            const account = accounts[0];
            await lottery.methods.compensateInvestor(account).send({from: account});

            const data = await lottery.methods.getCancelledCampaigns().call();
            const  campaignIds = data[0];
            const titles = data[1];
            const entrepreneurs = data[2];
            const price = data[3];
            const backers = data[4];
            const plleft = data[5];
            const ypledges = await lottery.methods.getYourCancelledPledges(account).call();
            this.setState({
              cancCampaignids: campaignIds.map((id) => id.toString()),
              cancCampaigntitles: titles,
              cancCampaignentrep: entrepreneurs,
              canccampaignPrice: price,
              canccampaignBackers: backers,
              canccampaignPledgesLeft: plleft,
              canccampaignYourPledges: ypledges,
            });

            const balance =await lottery.methods.getContractBalance().call();
      const balanceInEther = web3.utils.fromWei(balance.toString(), 'ether');
      this.setState({ balance: balanceInEther });

      const fees =await lottery.methods.totalFees().call();
      const feesInEther = web3.utils.fromWei(balance.toString(), 'ether');
      this.setState({ collectedFees: feesInEther });




        }
        catch (error) {
          console.error("Error in claim:", error);
          alert(`Failed to claim. Error: ${error.message}`);
        }


      };

      onWithdraw = async() =>
      {
        try{
          console.log("Claim from canceled campaigns");
          const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
            const account = accounts[0];
            await lottery.methods.withdrawFees().send({from:account});

            const balance =await lottery.methods.getContractBalance().call();
      const balanceInEther = web3.utils.fromWei(balance.toString(), 'ether');
      this.setState({ balance: balanceInEther });

      const fees =await lottery.methods.totalFees().call();
      const feesInEther = web3.utils.fromWei(balance.toString(), 'ether');
      this.setState({ collectedFees: feesInEther });




        }
        catch (error) {
          console.error("Error in withdraw:", error);
          alert(`Failed to withdraw. Error: ${error.message}`);
        }


      };
    
      onChange=async()=>
      {
        try{
          console.log("Claim from canceled campaigns");
          const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
            const account = accounts[0];

            const addr = document.getElementById("change").value;
            await lottery.methods.transferOwnership(addr).send({ from: account });

            const ownerAddress = await lottery.methods.owner().call();
            this.setState({ownerAddress});




        }
        catch (error) {
          console.error("Error in change:", error);
          alert(`Failed to change owner. Error: ${error.message}`);
        }


      };


      onBan=async()=>
        {
          try{
            console.log("Ban");
            const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
              const account = accounts[0];
  
              const addr = document.getElementById("ban").value;
              await lottery.methods.banEntrepreneur(addr).send({ from: account });
  
              let data = await lottery.methods.getActiveCampaignsSummary().call();
              let campaignIds = data[0];
              let titles = data[1];
              let entrepreneurs = data[2];
              let price = data[3];
              let backers = data[4];
              let plleft = data[5];
              let ypledges = await lottery.methods.getYourActivePledges(account).call();
             // let isEntrep = await lottery.methods.isEntrepreneur(account).call();
             // let isful= await lottery.methods.isFulfilled().call();
              this.setState({
                activeCampaignids: campaignIds.map((id) => id.toString()),
                activeCampaigntitles: titles,
                activeCampaignentrep: entrepreneurs,
                activecampaignPrice: price,
                activecampaignBackers: backers,
                activecampaignPledgesLeft: plleft,
                activecampaignYourPledges: ypledges,
               // activeCampaignisEntrep: isEntrep,
               // activeCampaignIsFulfilled:isful
              });


               data = await lottery.methods.getCancelledCampaigns().call();
              campaignIds = data[0];
             titles = data[1];
             entrepreneurs = data[2];
             price = data[3];
             backers = data[4];
             plleft = data[5];
             ypledges = await lottery.methods.getYourCancelledPledges(account).call();
            this.setState({
              cancCampaignids: campaignIds.map((id) => id.toString()),
              cancCampaigntitles: titles,
              cancCampaignentrep: entrepreneurs,
              canccampaignPrice: price,
              canccampaignBackers: backers,
              canccampaignPledgesLeft: plleft,
              canccampaignYourPledges: ypledges,
            });
             
  
  
  
  
          }
          catch (error) {
            console.error("Error in Ban:", error);
            alert(`Failed to ban. Error: ${error.message}`);
          }
  
  
        };

        onDestroy =async()=>{

          try{
            const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
            const account = accounts[0];
            await lottery.methods.destroyContract().send({from: account});

            let data = await lottery.methods.getActiveCampaignsSummary().call();
            let campaignIds = data[0];
            let titles = data[1];
            let entrepreneurs = data[2];
            let price = data[3];
            let backers = data[4];
            let plleft = data[5];
            let ypledges = await lottery.methods.getYourActivePledges(account).call();
           // let isEntrep = await lottery.methods.isEntrepreneur(account).call();
           // let isful= await lottery.methods.isFulfilled().call();
            this.setState({
              activeCampaignids: campaignIds.map((id) => id.toString()),
              activeCampaigntitles: titles,
              activeCampaignentrep: entrepreneurs,
              activecampaignPrice: price,
              activecampaignBackers: backers,
              activecampaignPledgesLeft: plleft,
              activecampaignYourPledges: ypledges,
             // activeCampaignisEntrep: isEntrep,
             // activeCampaignIsFulfilled:isful
            });

             data = await lottery.methods.getCancelledCampaigns().call();
              campaignIds = data[0];
             titles = data[1];
             entrepreneurs = data[2];
             price = data[3];
             backers = data[4];
             plleft = data[5];
             ypledges =await lottery.methods.getYourCancelledPledges(account).call();
            this.setState({
              cancCampaignids: campaignIds.map((id) => id.toString()),
              cancCampaigntitles: titles,
              cancCampaignentrep: entrepreneurs,
              canccampaignPrice: price,
              canccampaignBackers: backers,
              canccampaignPledgesLeft: plleft,
              canccampaignYourPledges: ypledges,
            });




          }
          catch (error) {
            console.error("Error in destroy:", error);
            alert(`Failed to destroy. Error: ${error.message}`);
          }

        };



  render() {
    return (
      <div>
        <h1>Crowdfunding DApp {this.state.message} </h1>
        <p>Current Address: {this.state.currAddress}</p>
        <p>Owner's Address: {this.state.ownerAddress}</p>
        <p>Contract Balance: {this.state.balance} ETH </p>
        <p>Collected Fees: {this.state.collectedFees}ETH </p>


  <div>
  <br></br><br></br><br></br>
  <h3>New campaign</h3>
  <label for="title">Title</label>
  <input type="text" id="title" placeholder="Campaign's ID" />
  <br></br>

  <label for="pledgeCost">Pledge cost</label>
  <input type="number" id="pledgeCost" />
  <br></br>
  <label for="numberOfPledges">Number of pledges</label>
  <input type="number" id="numberOfPledges" />
  <br></br>

  <button id="createButton" onClick={this.onCreate}>Create</button>
 
</div>
<br></br><br></br><br></br>
<div>
      <h3>Live Campaigns</h3>
      <table>
        <thead>
          <tr>
            <th>Entrepreneur</th>
            <th>Title</th>
            <th>price</th>
            <th>backers</th>
            <th>pledges left</th>
            <th>your pledges</th>
          </tr>
        </thead>
        <tbody>
          {this.state.activeCampaignids.map((id, index) => (
            <tr key={id}>
              <td>{this.state.activeCampaignentrep[index]}</td>
              <td>{this.state.activeCampaigntitles[index]}</td>
              <td>{this.state.activecampaignPrice[index].toString()}</td>
              <td>{this.state.activecampaignBackers[index].toString()}</td>
              <td>{this.state.activecampaignPledgesLeft[index].toString()}</td>
              <td>{this.state.activecampaignYourPledges[index].toString()}</td>
              <td>  <button id="PledgeButton" onClick={() => this.onPledge(id,this.state.activecampaignPrice[index])} >Pledge</button>

              <button id="Button1" onClick={() => this.onCancel(id)}> Cancel</button>
            <button
              id="Button2"
              onClick={() => this.onFulfill(id)}
              //disabled={!this.state.activeCampaignIsFulfilled[index]} // Το κουμπί είναι ενεργό μόνο αν η τιμή είναι true
            >
              Fulfill
            </button>

              
            
               </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    


       <br></br><br></br> 
    <div>
      <h3>Fulfilled Campaigns</h3>
      <table>
        <thead>
          <tr>
            <th>Entrepreneur</th>
            <th>Title</th>
            <th>price</th>
            <th>backers</th>
            <th>pledges left</th>
            <th>your pledges</th>
          </tr>
        </thead>
        <tbody>
          {this.state.fulCampaignids.map((id, index) => (
            <tr key={id}>
              <td>{this.state.fulCampaignentrep[index]}</td>
              <td>{this.state.fulCampaigntitles[index]}</td>
              <td>{this.state.fulcampaignPrice[index].toString()}</td>
              <td>{this.state.fulcampaignBackers[index].toString()}</td>
              <td>{this.state.fulcampaignPledgesLeft[index].toString()}</td>
              <td>{this.state.fulcampaignYourPledges[index].toString()}</td>
              
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <br></br><br></br><br></br>

       <h3>Canceled Campaigns    <button id="PledgeButton" onClick={() => this.onClaim()} >Claimm</button> </h3>
      <table>
        <thead>
          <tr>
            <th>Entrepreneur</th>
            <th>Title</th>
            <th>price</th>
            <th>backers</th>
            <th>pledges left</th>
            <th>your pledges</th>
          </tr>
        </thead>
        <tbody>
          {this.state.cancCampaignids.map((id, index) => (
            <tr key={id}>
              <td>{this.state.cancCampaignentrep[index]}</td>
              <td>{this.state.cancCampaigntitles[index]}</td>
              <td>{this.state.canccampaignPrice[index].toString()}</td>
              <td>{this.state.canccampaignBackers[index].toString()}</td>
              <td>{this.state.canccampaignPledgesLeft[index].toString()}</td>
              <td>{this.state.canccampaignYourPledges[index].toString()}</td>
              
            </tr>
          ))}
        </tbody>
      </table>

    
    <br></br>

    <div>
        <h3>Control Panel</h3>  
          <button id="withdrawbutton" onClick={()=> this.onWithdraw()}>Withdraw </button>
          <br></br>
          <button id="ChangeButton" onClick={()=> this.onChange()}>Change owner</button>
          <input type="text" id="change" placeholder="Enter new owners wallet address" />
          <br></br>
          <button id="banButton" onClick={()=> this.onBan()}>Ban Entrepreneur </button>
          <input type="text" id="ban" placeholder="Enter entrepenuers address " />
          <br></br>
          <button id="destroyButton" onClick={()=> this.onDestroy()}>Destroy </button>
          <br></br>

    </div>


    </div>
        
       
        
      
    );
  }
}

export default App;