using UnityEngine;

public abstract class EnemyBase : MonoBehaviour
{
    [Header("敌人基础属性")]
    [SerializeField] protected float moveSpeed = 2f;
    [SerializeField] protected int damage = 1;
    
    protected bool facingRight = true;
    protected Rigidbody2D rb;
    
    protected virtual void Start()
    {
        rb = GetComponent<Rigidbody2D>();
    }
    
    protected virtual void Update()
    {
        Movement();
    }
    
    protected abstract void Movement();
    
    protected virtual void OnCollisionEnter2D(Collision2D collision)
    {
        if (collision.gameObject.CompareTag("Player"))
        {
            // 处理与玩家的碰撞
            HandlePlayerCollision(collision.gameObject);
        }
    }
    
    protected virtual void HandlePlayerCollision(GameObject player)
    {
        // 可以在子类中重写此方法以实现特定的碰撞行为
    }
    
    protected virtual void Flip()
    {
        facingRight = !facingRight;
        transform.Rotate(0f, 180f, 0f);
    }
} 