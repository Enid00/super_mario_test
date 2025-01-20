using UnityEngine;

public class PatrolEnemy : EnemyBase
{
    [Header("巡逻设置")]
    [SerializeField] private float patrolDistance = 4f;
    private Vector2 startPosition;
    
    protected override void Start()
    {
        base.Start();
        startPosition = transform.position;
    }
    
    protected override void Movement()
    {
        float distanceFromStart = transform.position.x - startPosition.x;
        
        if (Mathf.Abs(distanceFromStart) >= patrolDistance)
        {
            Flip();
            moveSpeed *= -1;
        }
        
        rb.velocity = new Vector2(moveSpeed, rb.velocity.y);
    }
} 