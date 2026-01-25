var Player: GameObject;

function Start() {
    if (Player == null) {
        Player = GameObject.FindWithTag("Player");
    }
}

function Update(){
   if(Input.GetAxis("Vertical") != 0){
   
     GetComponent.<NetworkView>().RPC("walking",RPCMode.All,  Player.name);
  }
     else{  
       GetComponent.<NetworkView>().RPC("idle", RPCMode.All, Player.name);
    }
    }