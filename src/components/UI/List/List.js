import React, {Component} from 'react';
import './List.css';

class List extends Component {

    constructor(props) {
        super(props);
        this.refs = null;
    }

    state = {
        display: '',
        sub: null,
        refs: null,
        visible: false,
        selectedPosition: 0
    };

    componentDidMount() {
        const value = this.props.getLabel(this.props.value);
        this.setState({display: value === undefined ? '' : value});
        this.props.changeHandler(this.props.id, this.props.getLabel(this.props.value));
    };

    changeHandler = (event) => {
        const display = event.target.value;
        const sub = this.props.items.filter((item) => {
            return this.props.getLabel(item).toUpperCase().startsWith(display.toUpperCase());
        });
        let selectedPosition = this.state.selectedPosition;
        if (this.state.selectedPosition >= sub.length) {
            selectedPosition = sub.length - 1;
        };
        this.setState({selectedPosition: selectedPosition, sub: sub, display: display, visible: (sub.length > 0 && display.length > 0)});
        this.props.changeHandler(this.props.id, display);
        if (display === "") this.props.selectHandler(null, null);
    };

    selectHandler = () => {
        const item = this.state.sub[this.state.selectedPosition];
        const id = this.props.getId(item);
        const display = this.props.getLabel(item);
        const newState = {visible: false, display: display};
        this.setState(newState);
        this.props.selectHandler(id, display);
        this.props.changeHandler(this.props.id, display);
    };

    keyDownHandler = (event) => {
        if (event.key === "ArrowUp") {
            event.preventDefault();
            if (this.state.selectedPosition > 0) {
                this.setState({selectedPosition: this.state.selectedPosition - 1});
                this.refs[this.state.selectedPosition - 1].scrollIntoView();
            };
        };
        if (event.key === "ArrowDown") {
            event.preventDefault();
            if (this.state.selectedPosition < this.state.sub.length - 1) {
                this.setState({selectedPosition: this.state.selectedPosition + 1});
                this.refs[this.state.selectedPosition + 1].scrollIntoView();
            };
        };
        if (event.key === "Enter") {
            event.preventDefault();
            if (this.state.selectedPosition >= 0 && this.state.selectedPosition < this.state.sub.length) {
                this.selectHandler();
            };
        };
    };

    getClass = (id) => {
        if (this.state.selectedPosition === id) {
            return ["list-dropdownhighlight"];
        }
        return null;
    };

    mouseEnterHandler = (index) => {
        this.setState({selectedPosition: index});
    };

    render() {

        let list = null;

        this.refs = [];

        const addRef = (index, ref) => {
            if(!this.refs[index]) this.refs[index] = ref;
        };

        if (this.state.visible) {
            list = (
                <div className="list-dropdown">
                    {this.state.sub.map((item, index) => {
                        return (
                            <div 
                                className={this.getClass(index)} 
                                onMouseEnter={() => this.mouseEnterHandler(index)} 
                                key={this.props.getId(item)}
                                ref={ref => {addRef(index, ref)}}
                                onClick={() => this.selectHandler(this.props.getId(item), this.props.getLabel(item))}>{this.props.getLabel(item)}
                            </div>
                        );
                    })}                
                </div>
            );
        };

        return (
           <div className="list">
                <div onKeyDown={this.keyDownHandler} className="list-cell">
                    <input type="text" onKeyDown={this.keyDownHandler} onChange={this.changeHandler} value={this.state.display} className="list-input" readOnly={this.props.readOnly}/>
                    {list}
                </div>
           </div>
        );
    };

};

export default List;