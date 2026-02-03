using UnityEngine;
using UnityEngine.SceneManagement;
using System.Collections;

public class LoadMenu : MonoBehaviour
{

    // Use this for initialization
    void Update()
    {
        if(Input.GetKeyDown("space"))
        {
			SceneManager.LoadScene("mainmeny");
		}
    }
}