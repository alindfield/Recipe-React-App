import React, {Component} from 'react'
import classes from './Media.css';
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

        //const style = [classes.Buttons];
        //if (!this.state.modal || (!this.props.editing && !this.props.creating)) style.push(classes.Hidden);
//<div className={classes.Image}>         </div>
        return (
            <div className={classes.Media} onMouseEnter={() => this.mouseEnter()} onMouseLeave={() => this.mouseLeave()}>
                <div className={classes.Top}>
                    
                        <img src={this.props.media} alt=""/>
                    
                </div>
                <Files 
                    clickable 
                    accepts={['.jpg', '.gif']}
                    onChange={this.props.fileUploadHandler}
                    onError={this.props.errorHandler}>
                    <button disabled={!this.props.editing && !this.props.creating} style={{"display": "none"}} ref={this.ref}>Upload</button>
                </Files>
                <div className={classes.Bottom}>
                    <Buttons config={mediaConfig}/>
                </div>            
            </div>
        );
    };

};
//className={classes.Buttons}
export default Media;