import React, { useState } from 'react';
import { graphql, compose } from 'react-apollo';

import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import { withStyles } from '@material-ui/core/styles';

import Autosuggest from 'react-autosuggest';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';

import deburr from 'lodash/deburr';

import TextFieldInput from '../text-field-input'

import {
  ALL_BIRTH,
  ALL_PERSON,
} from '../../queries'


const renderInputComponent = (inputProps) => {
  const {
    classes,
    inputRef = () => {},
    ref,
    onChange,
    ...other
  } = inputProps;

  return (
    <TextFieldInput
      handleChange={onChange}
      InputProps={{
        inputRef: (node) => {
          ref(node);
          inputRef(node);
        },
        classes: {
          input: classes.input,
        },
      }}
      {...other}
    />
  )
};

const renderSuggestion = (suggestion, { query, isHighlighted }) => {

  const { surname, givname } = suggestion.__typename === 'BirthType' ? suggestion : suggestion.birthSet[0];

  const matches = match(surname, query);
  const parts = parse(surname, matches);

  return (
    <MenuItem
      selected={isHighlighted}
      component="div"
    >
      <div>
        {parts.map((part, index) =>
          part.highlight ? (
            <span key={String(index)} style={{ fontWeight: 500 }}>
              {part.text}
            </span>
          ) : (
            <strong key={String(index)} style={{ fontWeight: 300 }}>
              {part.text}
            </strong>
          ),
        )}
        {` `}
        { givname }
      </div>
    </MenuItem>
  );
};

const getSuggestions = (value, data) => {

  const inputValue = deburr(value.trim()).toLowerCase();
  const inputLength = inputValue.length;
  let count = 0;

  return inputLength === 0
    ? []
    : data.filter((suggestion) => {

      const { surname } = suggestion.__typename === 'BirthType' ? suggestion : suggestion.birthSet[0];

      const keep = count < 5 && surname.slice(0, inputLength).toLowerCase() === inputValue;

      if (keep) {
        count += 1;
      }

      return keep;
    });
};

const getSuggestionValue = (handleChange) => (suggestion) => {

  if (handleChange) handleChange(suggestion.id);

  const { surname, givname } = suggestion.__typename === 'BirthType' ? suggestion : suggestion.birthSet[0];

  return `${surname} ${givname}`
};

const styles = (theme) => ({
  root: {
    height: 250,
    flexGrow: 1,
  },
  container: {
    position: 'relative',
  },
  suggestionsContainerOpen: {
    position: 'absolute',
    zIndex: 10,
    marginTop: theme.spacing.unit,
    left: 0,
    right: 0,
  },
  suggestion: {
    display: 'block',
  },
  suggestionsList: {
    margin: 0,
    padding: 0,
    listStyleType: 'none',
  },
  divider: {
    height: theme.spacing.unit * 2,
  },
});

const IntegrationAutosuggest = ({ allPerson, allBirth, classes, name, value: idValue, handleChange, dataName='' }) => {
  // console.log(allPerson, allBirth);
  const [ value, setValue ] = useState(idValue ? dataName : '');
  const [ suggestions, setSuggestions ] = useState([]);

  const data = name === 'birth' ? allBirth : allPerson;

  return (
    <Autosuggest
      suggestions={suggestions}
      onSuggestionsFetchRequested={({ value }) => setSuggestions(getSuggestions(value, data))}
      onSuggestionsClearRequested={() => setSuggestions([])}
      getSuggestionValue={getSuggestionValue(handleChange)}
      renderSuggestion={renderSuggestion}
      renderInputComponent={renderInputComponent}

      inputProps={{
        classes,
        name,
        onChange: (event, { newValue }) => { setValue(newValue) },
        value,
      }}

      theme={{
        container: classes.container,
        suggestionsList: classes.suggestionsList,
        suggestion: classes.suggestion,
        suggestionsContainerOpen: classes.suggestionsContainerOpen,
      }}

      renderSuggestionsContainer={(options) => (
        <Paper
          {...options.containerProps}
        >
          {options.children}
        </Paper>
      )}
    />
  );
};

const withQueryPerson = graphql(ALL_PERSON,
  {
    props: ({ data: { allPerson, loading, error } }) => (
      { allPerson }
    ),
  }
);

const withQueryBirth = graphql(ALL_BIRTH,
  {
    props: ({ data: { allBirth, loading, error } }) => (
      { allBirth }
    )
  }

);

IntegrationAutosuggest.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(
  compose(withQueryPerson, withQueryBirth)(IntegrationAutosuggest)
);
