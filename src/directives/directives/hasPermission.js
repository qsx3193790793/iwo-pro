/**
 * 权限
 * @param binding.value 权限列表
 * @example
 * <button v-hasPermission="['xxx']">按钮</button>
 */
import {store} from '@/store/stores/Common/userInfo'

export default {
  name: 'hasPermission',
  inserted(el, binding, vnode) {
    if (!el) return;
    const {value} = binding;
    if (!value) return;
    const permissions = store.state.permissions || [];
    const res = (value || []).filter(v => permissions.includes('*:*:*') || permissions.includes(v));
    res.length === 0 && el.remove();
  }
}
