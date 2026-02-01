using UnityEngine;

public class PlayerNetworkController : MonoBehaviour
{
	void Start()
	{
		NetworkView nv = GetComponent<NetworkView>();

		// If not local player, disable control
		if (nv == null || !nv.isMine)
		{
			DisableLocalComponents();
		}
	}

	void DisableLocalComponents()
	{
		Transform cam = transform.Find("Camera");
		if (cam) cam.gameObject.SetActive(false);

		CharacterMotor motor = GetComponent<CharacterMotor>();
		if (motor) motor.enabled = false;

		FPSInputController input = GetComponent<FPSInputController>();
		if (input) input.enabled = false;

		AudioListener audio = GetComponent<AudioListener>();
		if (audio) audio.enabled = false;
	}
}
