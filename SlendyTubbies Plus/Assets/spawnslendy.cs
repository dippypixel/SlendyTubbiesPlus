using UnityEngine;

public class spawnslendy : MonoBehaviour
{
	public GameObject TinkyNormalPrefab;
	public GameObject TinkyCalmPrefab;
	public GameObject TinkyHomerPrefab;

	void Start()
	{
		SpawnEnemy();
	}

	void SpawnEnemy()
	{
		int fun = PlayerPrefs.GetInt("Fun", 0);

		GameObject enemyPrefab;

		if (fun == 1)
			enemyPrefab = TinkyCalmPrefab;
		else if (fun == 2)
			enemyPrefab = TinkyHomerPrefab;
		else
			enemyPrefab = TinkyNormalPrefab;

		if (enemyPrefab == null)
		{
			Debug.LogError("Enemy prefab is NULL");
			return;
		}

		Instantiate(
			enemyPrefab,
			transform.position,
			transform.rotation
		);
	}
}
