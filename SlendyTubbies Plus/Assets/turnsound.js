var turningsound : AudioClip ;

public var walkAnimation : AnimationClip;

function Update (){
Player = GameObject.FindWithTag("Player").transform;

GetComponent.<AudioSource>().clip = turningsound;
GetComponent.<AudioSource>().loop = true;

if(Input.GetKeyDown(KeyCode.A)){
GetComponent.<AudioSource>().Play();
GetComponent.<AudioSource>().loop = true;
}   
if(Input.GetKeyUp(KeyCode.A)){
  GetComponent.<AudioSource>().Stop();
    }
         
}
