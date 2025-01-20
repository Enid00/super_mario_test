using UnityEngine;

public class PlayerController : MonoBehaviour
{
    [Header("移动参数")]
    [SerializeField] private float moveSpeed = 5f;
    [SerializeField] private float jumpForce = 12f;
    
    [Header("地面检测")]
    [SerializeField] private Transform groundCheck;
    [SerializeField] private LayerMask groundLayer;
    [SerializeField] private float groundCheckRadius = 0.2f;
    
    private Rigidbody2D rb;
    private Animator animator;
    private bool isGrounded;
    private bool facingRight = true;
    
    private void Start()
    {
        rb = GetComponent<Rigidbody2D>();
        animator = GetComponent<Animator>();
    }
    
    private void Update()
    {
        // 地面检测
        isGrounded = Physics2D.OverlapCircle(groundCheck.position, groundCheckRadius, groundLayer);
        
        // 跳跃输入检测
        if (Input.GetKeyDown(KeyCode.Space) && isGrounded)
        {
            Jump();
        }
        
        // 水平移动输入
        float moveInput = Input.GetAxisRaw("Horizontal");
        Move(moveInput);
        
        // 更新动画
        UpdateAnimations(moveInput);
    }
    
    private void Move(float moveInput)
    {
        rb.velocity = new Vector2(moveInput * moveSpeed, rb.velocity.y);
        
        // 角色翻转
        if (moveInput > 0 && !facingRight || moveInput < 0 && facingRight)
        {
            Flip();
        }
    }
    
    private void Jump()
    {
        rb.velocity = new Vector2(rb.velocity.x, jumpForce);
        // 在这里添加跳跃音效
    }
    
    private void Flip()
    {
        facingRight = !facingRight;
        transform.Rotate(0f, 180f, 0f);
    }
    
    private void UpdateAnimations(float moveInput)
    {
        if (animator != null)
        {
            animator.SetBool("IsMoving", Mathf.Abs(moveInput) > 0.1f);
            animator.SetBool("IsGrounded", isGrounded);
        }
    }
} 