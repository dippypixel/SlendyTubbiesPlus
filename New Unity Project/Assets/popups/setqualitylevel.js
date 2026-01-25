var playerflashlight : boolean;
var playernv : boolean;
var normalmode : boolean;
var homermode : boolean;
var calmmode : boolean;
var calmUnlocked : boolean;
var homerUnlocked : boolean;

function OnGUI () {

    // Read prefs
    calmUnlocked  = PlayerPrefs.GetInt("CalmMode", 0) == 1;
    homerUnlocked = PlayerPrefs.GetInt("HomerMode", 0) == 1;

    var funValue = PlayerPrefs.GetInt("Fun", 0);

    // Sync toggles with fun
    normalmode = (funValue == 0);
    calmmode   = (funValue == 1);
    homermode  = (funValue == 2);

    // Detect if Normal can be unlocked
    var anyFunUnlocked = calmUnlocked || homerUnlocked;

    // SAFETY: always re-enable GUI at frame start
    GUI.enabled = true;

    // Make a background box
    GUI.Box (Rect (10,10,200,1000), "Graphics Resolution");

    // Make the first button. If it is pressed, Application.Loadlevel (1) will be executed
    if (GUI.Button (Rect (20,40,80,20), "Fastest")) {
       QualitySettings.currentLevel = QualityLevel.Fastest;
    }

    // Make the second button.
    if (GUI.Button (Rect (20,70,80,20), "Fast")) {
       QualitySettings.currentLevel = QualityLevel.Fast;
    }

    // Make the second button.
    if (GUI.Button (Rect (20,100,80,20), "Simple")) {
       QualitySettings.currentLevel = QualityLevel.Simple;
    }

    // Make the second button.
    if (GUI.Button (Rect (20,130,80,20), "Good")) {
       QualitySettings.currentLevel = QualityLevel.Good;
    }

    // Make the second button.
    if (GUI.Button (Rect (20,160,80,20), "Beautiful")) {
       QualitySettings.currentLevel = QualityLevel.Beautiful;
    }

    // Make the second button.
    if (GUI.Button (Rect (20,190,80,20), "Fantastic")) {
       QualitySettings.currentLevel = QualityLevel.Fantastic;
    }

    // Make a background box
    GUI.Box (Rect (10,220,200,1000), "Equipment");

      // Make the second button.

    // FLASHLIGHT
    var newFlashlight = GUI.Toggle(Rect(20,250,120,20), playerflashlight ,"Flashlight");

    if (newFlashlight && !playerflashlight)
    {
       playerflashlight = true;
       playernv = false;
       PlayerPrefs.SetInt("Equipment", 0);
    }

    playerflashlight = newFlashlight;


     // NIGHT VISION
    var newNV = GUI.Toggle(Rect(20,280,120,20), playernv, "NV Goggles");

    if (newNV && !playernv)
    {
       playernv = true;
       playerflashlight = false;
        PlayerPrefs.SetInt("Equipment", 1);
    }

    playernv = newNV;

        // Make a background box
    GUI.Box (Rect (10,310,200,1000), "Fun");

        // NORMAL MODE
    if (!anyFunUnlocked)
    {
       // Normal forced, locked
       GUI.enabled = false;
       GUI.Toggle(Rect(20,340,120,20), true, "Normal");
       GUI.enabled = true;

       // Gotta secure this shit
       PlayerPrefs.SetInt("Fun", 0);
    }
    else
    {
       var normalMode = GUI.Toggle(Rect(20,340,120,20), normalmode, "Normal");

       if (normalMode && !normalmode)
       {
          PlayerPrefs.SetInt("Fun", 0);
       }

       normalmode = normalMode;
    }

     // CALM MODE
    if (calmUnlocked)
    {
       var calmMode = GUI.Toggle(Rect(20,370,120,20), calmmode, "Calm");

       if (calmMode && !calmmode)
           PlayerPrefs.SetInt("Fun", 1);
    }
    else
    {
       GUI.enabled = false;
       GUI.Toggle(Rect(20,370,120,20), false, "Calm (Locked)");
       GUI.enabled = true;
    }

         // HOMER MODE
    if (homerUnlocked)
    {
       var homerMode = GUI.Toggle(Rect(20,400,120,20), homermode, "Homer");

       if (homerMode && !homermode)
           PlayerPrefs.SetInt("Fun", 2);
    }
    else
    {
       GUI.enabled = false;
       GUI.Toggle(Rect(20,400,120,20), false, "Homer (Locked)");
       GUI.enabled = true;
    }
}