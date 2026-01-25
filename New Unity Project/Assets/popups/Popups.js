
var timer : float = 0.0;
var spawning : boolean = false;
var spawnpoint : Transform;
var spawn1 : Transform;
var spawn2 : Transform;
var spawn3 : Transform;
var spawn4 : Transform;
var spawn5 : Transform;
var spawn6: Transform;
var spawn7: Transform;
var gos: GameObject[];
var shitgetreal: boolean = false;
var shitgetmorereal: boolean = false;
var randomPick: int = 0;
var telenumb: int = 10;
var house: GameObject;
var lala: GameObject;
var po: GameObject;

    var thePlayer: Transform;
var theEnemy: Transform;
var tinkydistance: float = 0.0;
var housedistance: float = 0.0;
var laladistance: float = 0.0;
var podistance: float = 0.0;


function Start() {
    telenumb = Random.Range(30, 200);
}

function Update() {
    //check if spawning at the moment, if not add to timer

    thePlayer = GameObject.FindWithTag("Player").transform;
    theEnemy = GameObject.FindWithTag("Enemy").transform;
    tinkydistance = (thePlayer.position - theEnemy.position).magnitude;
    housedistance = (thePlayer.position - house.transform.position).magnitude;
    laladistance = (thePlayer.position - lala.transform.position).magnitude;
    podistance = (thePlayer.position - po.transform.position).magnitude;
    if (tinkydistance < 50) {
        randomPick = 6;
    }
    else if (housedistance < 90) {
        randomPick = Random.Range(4, 5);
    }
    else if (podistance < 90) {
        randomPick = 3;
    }
    else if (laladistance < 90) {
        randomPick = 2;
    }
    else {
    randomPick = Mathf.Abs(Random.Range(1, 5));
    }

    if (!spawning) {
        timer += Time.deltaTime;
    }
    //when timer reaches 2 seconds, call Spawn function

    if (timer > telenumb) {
        Spawn();
    }
    gos = GameObject.FindGameObjectsWithTag("Paper");
    if (gos.length == 6 && shitgetreal == false) {
        Network.Instantiate(spawn6, spawnpoint.position, spawnpoint.rotation, 1);
        shitgetreal = true;
    }
    gos = GameObject.FindGameObjectsWithTag("Paper");
    if (gos.length == 1 && shitgetmorereal == false) {
        Network.Instantiate(spawn7, spawnpoint.position, spawnpoint.rotation, 1);
        shitgetmorereal = true;
    }
}
     
function Spawn() {
    telenumb = Random.Range(30, 200);
     //set spawning to true, to stop timer counting in the Update function
     spawning = true;
     //reset the timer to 0 so process can start over
     timer = 0;  
    //select a random number, inside a maths function absolute command to ensure it is a whole number    
     //create a location 'Transform' type variable to store one of 3 possible locations declared at top of script
     var location : Transform;
     
     //check what randomPick is, and select one of the 3 locations, based on that number
     if(randomPick == 1){
      location = spawn1;
      //yield WaitForSeconds(Random.Range(30,200));
      Debug.Log("Chose pos 1");
     }
     else if(randomPick == 2){
     //yield WaitForSeconds(Random.Range(30,200));
      location = spawn2;
      Debug.Log("Chose pos 2");
     }
     else if(randomPick == 3){
     //yield WaitForSeconds(Random.Range(30,200));
      location = spawn3;
      Debug.Log("Chose pos 3");
     }
     else if(randomPick == 4){
          //yield WaitForSeconds(Random.Range(30,200));
      location = spawn4;
      Debug.Log("Chose pos 4");
     }
          else if(randomPick == 5){
          //yield WaitForSeconds(Random.Range(30,200));
      location = spawn5;
      Debug.Log("Chose pos 5");
     }
          else if(randomPick == 6){
          //yield WaitForSeconds(Random.Range(30,200));
      location = spawn6;
      Debug.Log("Chose pos 6");
     }
          else if(randomPick == 7){
          //yield WaitForSeconds(Random.Range(30,200));
      location = spawn7;
      Debug.Log("Chose pos 7");
     }

     
     //create the object at point of the location variable
     var thingToMake : Transform = Network.Instantiate(location, spawnpoint.position, spawnpoint.rotation, 1);
     
     //halt script for 1 second before returning to the start of the process
     yield WaitForSeconds(1);
     //set spawning back to false so timer may start again
     spawning = false;
}