#pragma strict

private var nv : NetworkView;
private var syncPos : Vector3;
private var syncRot : Quaternion;

function Awake()
{
    nv = GetComponent.<NetworkView>();
    syncPos = transform.position;
    syncRot = transform.rotation;

    // Forces a first valid status
    if (nv && nv.isMine)
    {
        transform.position = syncPos;
        transform.rotation = syncRot;
    }
}

function OnSerializeNetworkView(stream : BitStream, info : NetworkMessageInfo)
{
    if (stream.isWriting)
    {
        syncPos = transform.position;
        syncRot = transform.rotation;

        stream.Serialize(syncPos);
        stream.Serialize(syncRot);
    }
    else
    {
        stream.Serialize(syncPos);
        stream.Serialize(syncRot);

        transform.position = syncPos;
        transform.rotation = syncRot;
    }
}
