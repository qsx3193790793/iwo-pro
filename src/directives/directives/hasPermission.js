/**
 * 权限
 * @param binding.value 权限列表
 * @example
 * <button v-has-permission="['xxx']">按钮</button>
 */
import {store} from '@/store/stores/Common/userInfo'

export default {
  name: 'hasPermission', mounted(el, binding, vnode) {
    if (!el) return;
    const permissions = store.state.permissions;
    const {value} = binding;
    (value || []).filter(v => permissions.includes('*:*:*') || permissions.includes(v)).length === 0 && el.remove();
  }
}
