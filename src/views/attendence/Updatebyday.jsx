import React, {Component} from 'react';
export class Updatebyday extends Component
{
  state={
    
  }
  
render()
{
  return(
    <div class="container">
    <div class="control-group">
      <h1>Students</h1>
      <h2>Total students : 23  </h2>
  <h2>  Total present : {this.state.count}/23</h2>
      <label class="contract_toggle"> Ranvir<input type="checkbox"/>
      <div class="toggle_bar"><div class="toggle_square"/></div></label>
      <label class="contract_toggle"> Himanshu<input type="checkbox"/>
      <div class="toggle_bar"><div class="toggle_square"/></div></label>
      <label class="contract_toggle"> Babu<input type="checkbox"/>
      <div class="toggle_bar"><div class="toggle_square"/></div></label>
      <label class="contract_toggle"> Babua<input type="checkbox"/>
      <div class="toggle_bar"><div class="toggle_square"/></div></label>
      <label class="contract_toggle"> pappu<input type="checkbox"/>
      <div class="toggle_bar"><div class="toggle_square"/></div></label>
      <label class="contract_toggle"> chacha<input type="checkbox"/>
      <div class="toggle_bar"><div class="toggle_square"/></div></label>
      
      <div class="btn">
			<div class="btn-back">
				<p>Are you sure you want to submit the attendence?</p>
				<button class="yes">Yes</button>
				<button class="no">No</button>
			</div>
			<div class="btn-front">Submit</div>
		</div>
   
    </div>
      </div>


);
}

}
export default Updatebyday