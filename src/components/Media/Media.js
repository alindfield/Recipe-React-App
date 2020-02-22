import React, {Component} from 'react'
import './Media.css';
import Files from 'react-files';
import Buttons from '../UI/Buttons/Buttons';

class Media extends Component {

    constructor(props) {
        super(props);
        this.ref = React.createRef();
    }

    state = {
        modal: false
    };

    mouseEnter = () => {
      this.setState({modal: true});
    };

    mouseLeave = () => {
       this.setState({modal: false});
    };

    uploadHandler = () => {
        this.ref.current.click();
    };

    render() {      

        const mediaConfig = {
            upload: {
                label: 'Upload',
                enabled: this.props.editing || this.props.creating,
                clickHandler: this.uploadHandler
            },
            clear: {
                label: 'Clear',
                enabled: this.props.editing || this.props.creating,
                clickHandler: this.props.clearHandler
            }
        };

        return (
            <div className="media" onMouseEnter={() => this.mouseEnter()} onMouseLeave={() => this.mouseLeave()}>
                <div className="media-top">
                        <img src={this.props.media} alt=""/>
                </div>
                <Files 
                    clickable 
                    accepts={['.jpg', '.gif']}
                    onChange={this.props.fileUploadHandler}
                    onError={this.props.errorHandler}>
                    <button disabled={!this.props.editing && !this.props.creating} style={{"display": "none"}} ref={this.ref}>Upload</button>
                </Files>
                <div className="media-bottom">
                    <Buttons config={mediaConfig}/>
                </div>            
            </div>
        );
    };

};
//className="Buttons}
export default Media;