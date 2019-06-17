import React from 'react';

import '../css/utility.scss';

// needs max length. anything else?

type Props = {
  placeholder: string,
  label: string,
  value?: string,
  validate?: (value: string) => boolean,
  onChange: ({value, error}: { value: string, error: boolean}) => void;
}

type State = {
  value: string,
  error: boolean
}

export default class extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      value: props.value || '',
      error: false
    }
  }

  componentDidUpdate(prevProps: Props) {
    if(prevProps.value !== this.props.value) {
      this.setState({
        value: this.props.value || ''
      })
    }
  }

  onChange = (evt: any) => {
    const value = evt.target.value;
    const error = this.props.validate ? this.props.validate(value) : false;

    this.setState({value, error});

    this.props.onChange({value, error});
  };

  render() {
    return (
      <label>
        <span className="hidden">{this.props.label}</span>
        <textarea
          placeholder={this.props.placeholder}
          value={this.state.value}
          onChange={this.onChange}
        />
        <span style={{color: 'red'}}>{this.state.error}</span>
      </label>
    );
  }
};
