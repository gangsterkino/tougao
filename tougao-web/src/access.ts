type UserRole = '管理员' | '编辑' | '会员' | '非会员';

export default (initialState: { currentUser: { role: UserRole } } | undefined) => {
  const role = initialState?.currentUser?.role;

  if (role === '非会员') {
    return {
      canSeeAdmin: false,
      canSeeEditor: false,
      canSeeMember: false,
    };
  }

  const canSeeAdmin = role === '管理员';
  const canSeeEditor = role === '编辑';
  const canSeeMember = role === '会员';

  return {
    canSeeAdmin,
    canSeeEditor,
    canSeeMember,
  };
};
