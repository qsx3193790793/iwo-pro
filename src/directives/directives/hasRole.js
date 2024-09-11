/**
 * 权限
 * @param binding.value 权限列表
 * @example
 * <button v-has-permission="['xxx']">按钮</button>
 */
import {store} from '@/store/stores/Common/userInfo'

export default {
  name: 'hasRole',
  bind(el, binding, vnode) {
    if (!el) return;
    const roles = store.state.roles;
    const {value} = binding;
    (value || []).filter(v => roles.includes('admin') || roles.includes(v)).length === 0 && el.remove();
  }
}
