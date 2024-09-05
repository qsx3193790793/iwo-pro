<template>
    <div class="tabs">
        <div class="flex">
            <div class="flex">
                <div :class="[{ 'btn': activeName === '0' }, 'el-button']" @click="actTag('0')">维度</div>
                <div :class="[{ 'btn': activeName === '1' }, 'el-button']" @click="actTag('1')">指标</div>
            </div>
            <div style="margin-left: auto;">
                <el-button type="primary" @click="sub">确认</el-button>
                <el-button @click="repick">重置</el-button>
            </div>

        </div>
        <div v-show="activeName === '0'" class="tabs">
            <el-tree ref="tree" :data="tagTreeData" show-checkbox node-key="id" default-expand-all
                :default-checked-keys="defaultArr" :props="defaultProps" @check="handleCheck">
            </el-tree>
        </div>
        <div v-show="activeName === '1'" class="tabs">
            <el-checkbox-group v-model="checkList">
                <el-checkbox style="width: 100%;margin-bottom: 0.14rem;" v-for="(item, index) in checkData" :key="index"
                    :label="item.id">{{ item.label }}</el-checkbox>
            </el-checkbox-group>
        </div>
    </div>
</template>

<script>
import { tagTreeData, checkData } from './tagMock.js'
export default {
    name: 'reportForms_AddDialog',
    props: {
        zb: {
            type: Array,
            default: () => []
        },
        wd: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
            activeName: '0',
            tagTreeData: tagTreeData,
            checkData: checkData,
            defaultArr: [],//默认选中的
            defaultProps: {
                children: 'children',
                label: 'label'
            },
            selectedNode: [],//维度
            checkList: []//指标
        }
    },
    methods: {
        repick() {
            this.checkList = []
            this.$refs.tree.setCheckedKeys([]);
        },
        actTag(type) {
            this.activeName = type
        },
        sub() {
            let checkedIds = this.$refs.tree.getCheckedKeys()

            let arr1 = []
            this.tagTreeData.forEach(element => {
                for (let index = 0; index < element.children.length; index++) {
                    const elements = element.children[index];//子节点
                    if (checkedIds.includes(elements.id)) {
                        arr1.push({
                            id: elements.id,
                            parentId: element.id,
                            label: elements.label,
                            parentLabel: element.label,
                            string: element.label + '-' + elements.label
                        })
                    }

                }
            });
            let arr2 = checkData.filter(element =>
                this.checkList.includes(element.id)
            ).map(element => {
                return {
                    id: element.id,
                    label: element.label
                };
            });
            // 输出结果
            this.$emit('submit', {
                wd: arr1,
                zb: arr2
            })
        },
        handleCheck(data, checked) {
            if (checked) {
                // 如果节点被选中，检查是否有其他子节点已被选中
                const parentNode = this.findParentNode(data, this.tagTreeData);
                if (parentNode && parentNode.disabled) {//禁用的才互斥
                    // 取消其他子节点的选中状态
                    parentNode.children.forEach(child => {
                        if (child.id !== data.id) {
                            this.$refs.tree.setChecked(child, false);
                        }
                    });
                    // 更新父节点记录的选中子节点 ID
                    parentNode.selectedChildId = data.id;
                }
            } else {
                // 如果节点被取消选中，更新父节点记录的选中子节点 ID 为 null
                const parentNode = this.findParentNode(data, this.tagTreeData);
                if (parentNode) {
                    parentNode.selectedChildId = null;
                }
            }
        },
        findParentNode(node, nodeList) {
            for (let i = 0; i < nodeList.length; i++) {
                if (nodeList[i].children && nodeList[i].children.some(child => child.id === node.id)) {
                    return nodeList[i];
                } else if (nodeList[i].children && nodeList[i].children.length > 0) {
                    const foundParent = this.findParentNode(node, nodeList[i].children);
                    if (foundParent) return foundParent;
                }
            }
            return null;
        }

    },
    mounted() {
        if (this.zb.length) {
            this.checkList.push(...this.zb.map(element => element.id));
        }

        if (this.wd.length) {
            this.$nextTick(() => {
                const arr = this.wd.map(element => element.id);
                this.$refs.tree.setCheckedKeys(arr);
            });
        }
    }
}

</script>
<style scoped>
.flex {
    display: flex;
    flex-wrap: nowrap;
}

.btn {
    color: #FFF;
    background-color: #409EFF;
    border-color: #409EFF;
}

.tabs {
    padding: 0.2rem;
}
</style>