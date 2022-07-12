import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { Set as ImmutableSet } from 'immutable';
import noop from 'lodash/noop';
import { toggleStatusReport } from '../actions/reports';
import { MediaGallery, Video } from '../features/ui/util/async_components';
import Bundle from '../features/ui/util/bundle';
import StatusContent from './status_content';
import Switch from './switch';

const mapStateToProps = (state, { id }) => ({
  status: state.getIn(['statuses', id]),
  checked: state.getIn(['reports', 'new', 'status_ids'], ImmutableSet()).includes(id),
});

const mapDispatchToProps = (dispatch, { id }) => ({
  onToggle(e) {
    dispatch(toggleStatusReport(id, e.target.checked));
  },
});

export default
@connect(mapStateToProps, mapDispatchToProps)
class StatusCheckBox extends ImmutablePureComponent {

  static propTypes = {
    status: ImmutablePropTypes.map.isRequired,
    checked: PropTypes.bool,
    onToggle: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
  };

  render () {
    const { status, checked, onToggle, disabled } = this.props;
    let media = null;

    if (status.get('reblog')) return null

    if (status.get('media_attachments').size > 0) {
      if (status.get('media_attachments').some(item => item.get('type') === 'unknown')) {

      } else if (status.getIn(['media_attachments', 0, 'type']) === 'video') {
        const video = status.getIn(['media_attachments', 0]);

        media = (
          <Bundle fetchComponent={Video} loading={this.renderLoadingVideoPlayer} >
            {Component => (
              <Component
                preview={video.get('preview_url')}
                blurhash={video.get('blurhash')}
                src={video.get('url')}
                alt={video.get('description')}
                aspectRatio={video.getIn(['meta', 'small', 'aspect'])}
                width={239}
                height={110}
                inline
                sensitive={status.get('sensitive')}
                onOpenVideo={noop}
              />
            )}
          </Bundle>
        );
      } else {
        media = (
          <Bundle fetchComponent={MediaGallery} loading={this.renderLoadingMediaGallery} >
            {Component => <Component media={status.get('media_attachments')} sensitive={status.get('sensitive')} onOpenMedia={noop} />}
          </Bundle>
        );
      }
    }

    return (
      <div className={[_s.default, _s.flexRow].join(' ')}>
        <div className={[_s.default].join(' ')}>
          <StatusContent status={status} />
          {media}
        </div>

        <div className={[_s.default, _s.mlAuto].join(' ')}>
          <Switch checked={checked} onChange={onToggle} disabled={disabled} />
        </div>
      </div>
    )
  }

}
