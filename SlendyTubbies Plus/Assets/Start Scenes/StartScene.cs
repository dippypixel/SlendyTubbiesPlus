using UnityEngine;
using UnityEngine.SceneManagement;
using System.Collections;

public class StartScene : MonoBehaviour
{

    // Use this for initialization
    void Start()
    {
        if(PlayerPrefs.GetInt("FirstLaunch") == 0)
        {
            //First launch
            PlayerPrefs.SetInt("FirstLaunch", 1);
            SceneManager.LoadScene("Help");
        }
        else
        {
            //Load mainmenu if its not the first launch
            SceneManager.LoadScene("mainmeny");
        }
    }

}