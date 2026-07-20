# LORA手撕

Owner: 吉祥 郑

[(4 封私信) 动手实现 LoRA - LoRA from scratch - 知乎](https://zhuanlan.zhihu.com/p/702419731)

- α：用于调整学习率，α越大越激进
- r：由于不同的rank，在进行矩阵乘法之后元素的大小可能会与r有关，r越大，可能乘积的元素越大，因此需要把元素进行缩放

```python
import torch.nn as nn
import torch.nn.functional as F

class LoraLinear(nn.Module):
    def __init__(
        self,
        base_layer: nn.Linear,  # 原来的线性层
        r: int = 8,  # lora rank
        alpha: int = 16,  # lora alpha
        dropout_p: float = 0.0,  # lora dropout
    ):
        super(LoraLinear, self).__init__()
        self.base_layer = copy.deepcopy(base_layer)
        self.r = r
        self.alpha = alpha
        self.dropout = nn.Dropout(dropout_p)

        # 定义 lora_A 和 lora_B 为 Parameter
        **# 自己定义参数矩阵的时候，记得input维度是第二维**
        self.lora_A = nn.Parameter(torch.empty((r, base_layer.in_features))
        self.lora_B = nn.Parameter(torch.empty((base_layer.out_features, r))

        # 初始化 lora 矩阵
        nn.init.normal_(self.lora_A, mean=0.0, std=0.02)
        nn.init.zeros_(self.lora_B)

        **# 冻结原来的层的参数
        for param in self.base_layer.parameters():
            param.requires_grad = False**

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        scaling = float(self.alpha) / float(self.r)  # lora 缩放系数
        lora_adjustment = F.linear(self.dropout(x), self.lora_A)
        lora_adjustment = F.linear(lora_adjustment, self.lora_B)
        return self.base_layer(x) + lora_adjustment * scaling
        
```