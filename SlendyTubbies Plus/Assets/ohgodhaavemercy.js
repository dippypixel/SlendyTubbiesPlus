#pragma strict

function Update()
{
    if (transform.localScale.x > 1000)
    {
        Debug.LogError(
            "SCALE BROKEN on " + gameObject.name +
            " | scale = " + transform.localScale
        );
    }
}