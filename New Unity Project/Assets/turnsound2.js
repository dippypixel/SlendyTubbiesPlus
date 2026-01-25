var turningsound : AudioClip ;

public var walkAnimation : AnimationClip;

function Update (){
Player = GameObject.FindWithTag("Player").transform;

GetComponent.<AudioSource>().clip = turningsound;

if(Input.GetKeyDown(KeyCode.A)){
GetComponent.<AudioSource>().Play();
}   
if(Input.GetKeyUp(KeyCode.A)){
  GetComponent.<AudioSource>().Stop();
    }
         
}
