using UnityEngine;
using UnityEngine.SceneManagement;

public class GameManager : MonoBehaviour
{
    public static GameManager Instance { get; private set; }
    
    [Header("游戏设置")]
    public int playerLives = 3;
    public int currentScore = 0;
    public bool isGameOver = false;
    
    private void Awake()
    {
        if (Instance == null)
        {
            Instance = this;
            DontDestroyOnLoad(gameObject);
        }
        else
        {
            Destroy(gameObject);
        }
    }
    
    public void GameOver()
    {
        isGameOver = true;
        // 显示游戏结束UI
        // 播放游戏结束音效
    }
    
    public void RestartGame()
    {
        isGameOver = false;
        playerLives = 3;
        currentScore = 0;
        SceneManager.LoadScene(SceneManager.GetActiveScene().buildIndex);
    }
    
    public void Victory()
    {
        // 显示胜利UI
        // 播放胜利音效
    }
} 