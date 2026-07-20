# 454. 四数相加 II

Tags: 哈希表
URL: https://leetcode.cn/problems/4sum-ii/description/

我的方法，把4个数分为两组，把两组存到multi map里面，遍历其中一组的map，看看相加是否为0，超出了时间限制。时间复杂度为o(n2 * log n)

```cpp
class Solution
{
public:
    int fourSumCount(vector<int> &nums1, vector<int> &nums2, vector<int> &nums3, vector<int> &nums4)
    {
        int n = nums1.size();
        multimap<int, pair<int, int>> nums1_2;
        for (int i = 0; i < n; i++)
            for (int j = 0; j < n; j++)
            {
                pair<int, int> tmp = make_pair(i, j);
                nums1_2.insert(make_pair(nums1[i] + nums2[j], tmp));
            }
        int counter = 0;
        for (int k = 0; k < n; k++)
            for (int l = 0; l < n; l++)
            {
                auto range = nums1_2.equal_range(-(nums3[k] + nums4[l]));
                for (auto i = range.first; i != range.second; ++i)
                {
                    counter++;
                }
            }

        return counter;
    }
};
```

力扣方法，也是分为两组，但是map里面记录的是同一个值出现的组合次数。复杂度为o(n2)，因为unordered map的取值的复杂度为o(1)

```cpp
class Solution {
public:
    int fourSumCount(vector<int>& A, vector<int>& B, vector<int>& C, vector<int>& D) {
        unordered_map<int, int> umap; //key:a+b的数值，value:a+b数值出现的次数
        // 遍历大A和大B数组，统计两个数组元素之和，和出现的次数，放到map中
        for (int a : A) {
            for (int b : B) {
                umap[a + b]++;
            }
        }
        int count = 0; // 统计a+b+c+d = 0 出现的次数
        // 再遍历大C和大D数组，找到如果 0-(c+d) 在map中出现过的话，就把map中key对应的value也就是出现次数统计出来。
        for (int c : C) {
            for (int d : D) {
                if (umap.find(0 - (c + d)) != umap.end()) {
                    count += umap[0 - (c + d)];
                }
            }
        }
        return count;
    }
};
```