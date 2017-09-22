import React, { Component } from 'react';
import { connect } from 'react-redux';
import Select  from 'react-select';
import './styles/Controls.css';

class Controls extends Component {

    constructor(props){
        super(props);

        console.log("constructor props", this.props);
        this.state = {
            disabled: false,
            searchable: true,
            clearable: true,
            selectValue: 'FR',
            isCountriesFetching : this.props.isCountriesFetching,
            countriesOptions : this.props.countriesOptions,
        };
    }

    setCountryOptions = () => {
        var countriesOptions = this.props.countries.map((country) => {
            return { value : country.iso2Code,
                label : country.name };
            }
        );
        console.log("countriesOptions ", countriesOptions);
        return countriesOptions;
    }
    componentWillReceiveProps(nextProps)
    {
        console.log("Controls componentWillReceiveProps : ", nextProps);
        if (nextProps === this.props)
        {
        }
        this.props = nextProps;

        this.setState({ isCountriesFetching: this.props.isCountriesFetching,
            countriesOptions : this.props.countriesOptions,
            selectValue: 'FR'}
        );
    }


    getValidationState = () => {
        const length = this.state.value.length;
        if (length > 10) return 'success';
        else if (length > 5) return 'warning';
        else if (length > 0) return 'error';
    }

    handleChange = (e) => {
        this.setState({ value: e.target.value });
    }

    logChange = (val) => {
        console.log("Selected: " + JSON.stringify(val));
    }

    updateValue = (newValue) => {
        if (newValue === null)
        {
            return;
        }
        this.setState(
            {
                selectValue: newValue
            }, () => {
                this.props.onCountrySelected(this.state.selectValue);
            }
        );
    }


    render() {
        console.log("Controls render state: ", this.state);

        return (
            <div className="Controls">
                <Select ref="stateSelect"
                    addLabelText="Toto"
                    autofocus options={this.state.countriesOptions}
                    simpleValue clearable={this.state.clearable}
                    name="selected-state"
                    disabled={this.state.disabled}
                    value={this.state.selectValue}
                    onChange={(newValue) => { this.updateValue(newValue); }}
                    searchable={this.state.searchable}
                    isLoading={this.state.isCountriesFetching}/>
                <h4 className="help">Select your country</h4>
            </div>
        );
    }
}

function mapStateToProps(state)
{
    const { countries, countriesOptions, isCountriesFetching, countryGdp } = state;
    return {
        countries,
        countriesOptions,
        isCountriesFetching,
        countryGdp
    }
}
export default connect(mapStateToProps) (Controls);
