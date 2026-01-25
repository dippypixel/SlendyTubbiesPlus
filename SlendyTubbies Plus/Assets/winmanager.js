
function Start ()
{
    var lastLevel = PlayerPrefs.GetInt("LastLevelWon", -1);

    if (lastLevel == 9)
    {
        PlayerPrefs.SetInt("CalmMode", 1);
    }
    else if (lastLevel == 10)
    {
        PlayerPrefs.SetInt("HomerMode", 1);
    }
    else if (lastLevel == 11)
    {
        PlayerPrefs.SetInt("UnlockEquipment", 1);
    }

    PlayerPrefs.Save();
}
