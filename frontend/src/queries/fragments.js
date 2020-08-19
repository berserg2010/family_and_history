import { gql } from "apollo-boost";


export const objectField = `
  id,
  note,
  submitted,
  submitter{
    id
  },
  changed,
  changer{
    id
  }
`;

export const eventField = `
  datetime,
  ${objectField}
`;

export const responseField = `
  status
  formErrors
`;

// EVENT
export const birthFragment = {
  birthField: gql`
    fragment birthField on BirthType{
      gender,
      childBirthSet{
        id,
        reltofath,
        reltomoth,
        childnbrfath,
        childnbrmoth,
        family{
          id,
        },
        birth{
          id,
        },
      }
      likes,
      person{
        id,
      },
      givname,
      surname,
      ${eventField}
    }
  `
};

export const marriageFragment = {
  marriageField: gql`
    fragment marriageField on MarriageType{
      family{
        id
      },
      husband{
        id,
        birthSet{
          id,
          surname,
          givname
        }
      },
      wife{
        id,
        birthSet{
          id,
          surname,
          givname
        }
      },
      husbname,
      wifename,
      likes,
      ${eventField}
    }
  `,
  childField: gql`
    fragment childField on ChildType{
      id,
      childnbrfath,
      childnbrmoth,
      reltofath,
      reltomoth,
      birth{
        id,
        person{
          id
        },
        surname,
        givname,
      }
    }
`};

// OBJECT
export const personFragment = {
  personField: gql`
    fragment personField on PersonType{
      user{
        id
      },
      birthSet{
        ...birthField
      },
      marriageHusbandSet{
        ...marriageField
      },
      marriageWifeSet{
        ...marriageField
      },
      ${objectField}
    }
    ${birthFragment.birthField}
    ${marriageFragment.marriageField}
`};

export const familyFragment = {
  familyField: gql`
    fragment familyField on FamilyType{
      child{
        ...birthField
      },
      childFamilySet{
        ...childField
      },
      marriageSet{
        ...marriageField
      },
      ${objectField}
    }
    ${birthFragment.birthField}
    ${marriageFragment.childField}
    ${marriageFragment.marriageField}

`};
