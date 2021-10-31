import {Button, useTheme} from 'dooboo-ui';
import {StyleSheet, Text, View} from 'react-native';

import React from 'react';
import {RootStackNavigationProps} from '../navigations/RootStack';
import {TextInputMask} from 'react-native-masked-text';
import {User} from '../../types';
import {getString} from '../../../STRINGS';
import moment from 'moment';
import styled from '@emotion/native';

const URL_SEARCH_CNPJ = 'https://public.fluxoresultados.com.br/v1/cnpj/';

const Container = styled.View`
  flex: 1;
  align-self: stretch;
  overflow: scroll;
  background-color: ${({theme}) => theme.background};
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  overflow: hidden;
`;

interface Props {
  navigation: RootStackNavigationProps<'Dashboard'>;
}

function Dashboard(props: Props): React.ReactElement {
  const {changeThemeType} = useTheme();
  const [isLoggingIn, setIsLoggingIn] = React.useState<boolean>(false);
  const [cnpj, setCnpj] = React.useState<string>('16.501.555/0001-57');
  const [error, setError] = React.useState<string>('');
  const [cnpjData, setcnpjData] = React.useState<any>({});
  let _cpfRef;

  const onSearch = (): void => {
    setIsLoggingIn(true);

    let valCnpj = cnpj
      .replaceAll('.', '')
      .replaceAll('/', '')
      .replaceAll('-', '');
    let mUrl = `${URL_SEARCH_CNPJ}${valCnpj}`;
    console.log({mUrl});

    fetch(mUrl)
      .then((response) => response.json())
      .then((json) => {
        setIsLoggingIn(false);
        if (json.status == 'ERROR') {
          setcnpjData({});
          setError(' No Data found for CNPJ');
        } else setcnpjData(json);
      })
      .catch((error) => {
        setIsLoggingIn(false);
        setcnpjData({});
        console.error(error);
      });
  };

  const getStrDate = (date: any): string => {
    let str = moment(date).format('DD-MM-yyyy');

    return str;
  };

  return (
    <Container>
      <View
        style={{
          flexDirection: 'row',
          marginTop: 8,
        }}
      >
        <TextInputMask
          ref={(ref) => (_cpfRef = ref)}
          type={'cnpj'}
          value={cnpj}
          autoFocus={true}
          placeholder={'Enter CNPJ'}
          onChangeText={(cnpjVal) => {
            console.log('cnpjVal-->>>', cnpjVal);
            setCnpj(cnpjVal);
          }}
          style={{
            backgroundColor: 'white',
            borderColor: '#bbb',
            borderWidth: 0.5,
            borderRadius: 40,
            paddingHorizontal: 16,
            paddingVertical: 8,
            width: '60%',
          }}
        />
        <View style={{width: 16}} />
        <Button
          testID="btn-login"
          loading={isLoggingIn}
          onPress={(): void => onSearch()}
          text={getString('SEARCH')}
        />
      </View>
      {error.length > 0 && <Text style={styles.error}>{error}</Text>}
      <View style={styles.card}>
        {cnpjData?.fantasia?.length > 0 && (
          <View style={styles.rowWrap}>
            <Text style={styles.labelStyle}>{`Company Name: `}</Text>
            <Text style={styles.valueStyle}>{`${cnpjData?.fantasia}`}</Text>
          </View>
        )}
        {cnpjData?.nome?.length > 0 && (
          <View style={styles.rowWrap}>
            <Text style={styles.labelStyle}>{`Company Legal Name: `}</Text>
            <Text style={styles.valueStyle}>{`${cnpjData?.nome}`}</Text>
          </View>
        )}

        {cnpjData?.situacao && (
          <View style={styles.rowWrap}>
            <Text style={styles.labelStyle}>{`Status: `}</Text>
            <Text style={styles.valueStyle}>{`${getString(
              cnpjData?.situacao,
            )}`}</Text>
          </View>
        )}

        {cnpjData?.telefone && (
          <View style={styles.rowWrap}>
            <Text style={styles.labelStyle}>{`Phone Number: `}</Text>
            <Text style={styles.valueStyle}>{`${cnpjData?.telefone.replaceAll(
              '/',
              '\n',
            )}`}</Text>
          </View>
        )}

        {cnpjData?.atividade_principal && (
          <View style={styles.rowWrap}>
            <Text style={styles.labelStyle}>{`Number of Activities: `}</Text>
            <Text
              style={styles.valueStyle}
            >{`${cnpjData?.atividade_principal.length}`}</Text>
          </View>
        )}

        {cnpjData?.capital_social && (
          <View style={styles.rowWrap}>
            <Text style={styles.labelStyle}>{`Initiial income: `}</Text>
            <Text
              style={styles.valueStyle}
            >{`${cnpjData?.capital_social}`}</Text>
          </View>
        )}

        {cnpjData?.ultima_atualizacao && (
          <View style={styles.rowWrap}>
            <Text style={styles.labelStyle}>{`Date of last update: `}</Text>
            <Text style={styles.valueStyle}>{`${getStrDate(
              cnpjData?.ultima_atualizacao,
            )}`}</Text>
          </View>
        )}
      </View>
    </Container>
  );
}

export default Dashboard;

const styles = StyleSheet.create({
  card: {
    marginTop: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
    padding: 8,
  },
  error: {
    color: '#F33',
    fontWeight: 'bold',
    fontSize: 14,
    marginTop: 8,
  },
  labelStyle: {
    color: '#333',
    fontWeight: 'bold',

    lineHeight: 20,
  },
  valueStyle: {
    fontSize: 14,
    lineHeight: 20,
  },
  valueBoldStyle: {
    fontSize: 14,
    fontWeight: 'bold',
    lineHeight: 20,
  },
  rowWrap: {
    flexDirection: 'row',
  },
});
