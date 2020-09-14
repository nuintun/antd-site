import Secured from './Secured';
import Authorized from './Authorized';
import check from './CheckPermissions';
import renderAuthorize from './renderAuthorize';

Authorized.check = check;
Authorized.Secured = Secured;

const RenderAuthorize = renderAuthorize(Authorized);

export default RenderAuthorize;
