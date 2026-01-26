#pragma strict

private var fogApplied : boolean = false;

function Update()
{
    // Tinky invisible on
    if (EnemyScriptPlayer.tinkyInvisible && !fogApplied)
    {
        RenderSettings.fog = false;
        fogApplied = true;
    }
    else if (!EnemyScriptPlayer.tinkyInvisible && fogApplied)
    {
        RenderSettings.fog = true;
        fogApplied = false;
    }
}
