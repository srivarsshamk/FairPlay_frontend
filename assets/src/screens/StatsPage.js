import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../components/LanguageSwitcher';
import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import CountryFlag from 'react-native-country-flag';
import { useNavigation } from '@react-navigation/native';
import { IoHome } from 'react-icons/io5';

const SpaceBackground = () => (
  <div style={{
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'radial-gradient(ellipse at bottom, #1b2735 0%, #090a0f 100%)',
    zIndex: -1
  }} />
);

const DopingStatsChart = () => {
  const { t } = useTranslation();
  const [data] = useState([
    { country: t('country.china'), countryCode: 'CN', samples: 19228, violations: 0.2 },
    { country: t('country.germany'), countryCode: 'DE', samples: 13653, violations: 0.3 },
    { country: t('country.russia'), countryCode: 'RU', samples: 10186, violations: 0.8 },
    { country: t('country.usa'), countryCode: 'US', samples: 6782, violations: 1.2 },
    { country: t('country.japan'), countryCode: 'JP', samples: 5706, violations: 0.2 },
    { country: t('country.india'), countryCode: 'IN', samples: 3865, violations: 3.2 },
    { country: t('country.canada'), countryCode: 'CA', samples: 3846, violations: 1.1 },
    { country: t('country.mexico'), countryCode: 'MX', samples: 2252, violations: 1.4 },
    { country: t('country.kazakhstan'), countryCode: 'KZ', samples: 2174, violations: 1.9 },
    { country: t('country.southAfrica'), countryCode: 'ZA', samples: 2033, violations: 2.9 }
  ]);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload?.[0]) {
      const data = payload[0].payload;
      return (
        <div style={{
          backgroundColor: 'rgba(0,0,0,0.8)',
          padding: '16px',
          borderRadius: '8px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '8px'
          }}>
            <CountryFlag
              isoCode={data.countryCode}
              size={25}
              style={{ marginRight: '10px' }}
            />
            <p style={{ color: 'white', fontSize: '18px', fontWeight: 'bold', fontFamily: 'Orbitron, sans-serif' }}>
              {data.country}
            </p>
          </div>
          <p style={{ color: '#4CAF50', fontSize: '14px', fontFamily: 'Orbitron, sans-serif' }}>
            {t('labels.samplesTested')}: {data.samples.toLocaleString()}
          </p>
          <p style={{ color: '#4CAF50', fontSize: '14px', fontFamily: 'Orbitron, sans-serif' }}>
            {t('labels.violationRate')}: {data.violations}%
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ height: '400px' }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 20, right: 30, left: 100, bottom: 20 }}
        >
          <XAxis type="number" domain={[0, 4]} stroke="#fff" />
          <YAxis
            dataKey="country"
            type="category"
            stroke="#fff"
            width={100}
            tickFormatter={(value, index) => {
              const country = data[index];
              return country.country;
            }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="violations" fill="#4CAF50" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

const StatsPage = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const reports = [
    {
      type: 'WADA',
      component: <DopingStatsChart />,
      insights: [
        {
          icon: '📊',
          label: t('insights.mostSamplesTested'),
          value: `${t('country.china')}: 19,228 Samples`
        },
        {
          icon: '⚠️',
          label: t('insights.highestViolations'),
          value: `${t('country.india')}: 3.2%`
        },
        {
          icon: '✅',
          label: t('insights.lowestViolationRate'),
          value: `${t('country.china')} & ${t('country.japan')}: 0.2%`
        }
      ],
      courtesyText: t('global.courtesyText')
    }
  ];

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'transparent',
        padding: '24px',
        color: 'white',
        fontFamily: 'Orbitron, sans-serif',
        position: 'relative'
      }}
    >
      <SpaceBackground />
      <div
        style={{
          maxHeight: '100vh',
          overflowY: 'auto',
          paddingRight: '10px',
          position: 'relative',
          zIndex: 1
        }}
      >
        <header style={{
          textAlign: 'center',
          marginBottom: '32px'
        }}>
          <h1 style={{
            fontSize: '24px',
            fontWeight: 'bold',
            marginBottom: '8px',
            color: 'white'
          }}>
            {t('global.antiDopingStats')}
          </h1>
          <p style={{ color: '#4CAF50' }}>{t('global.globalTestingInsights')}</p>
          <LanguageSwitcher />
          <div style={{
            height: '4px',
            width: '96px',
            backgroundColor: '#4CAF50',
            margin: '16px auto 0'
          }} />
        </header>

        <div style={{ maxWidth: '72rem', margin: '0 auto' }}>
          {reports.map((report, index) => (
            <div key={index} style={{
              backgroundColor: 'rgba(18, 18, 18, 0.8)',
              borderRadius: '12px',
              padding: '24px',
              marginBottom: '24px',
              border: '1px solid #4CAF50'
            }}>
              <div style={{ marginBottom: '32px' }}>{report.component}</div>

              <div>
                <h2 style={{
                  fontSize: '20px',
                  fontWeight: 'semibold',
                  color: '#4CAF50',
                  marginBottom: '16px'
                }}>
                  {t('global.keyInsights')}
                </h2>
                <div>
                  {report.insights.map((insight, i) => (
                    <div
                      key={i}
                      style={{
                        backgroundColor: 'rgba(30, 30, 30, 0.8)',
                        borderRadius: '8px',
                        padding: '16px',
                        marginBottom: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        border: '1px solid #4CAF50'
                      }}
                    >
                      <span style={{ fontSize: '24px' }}>{insight.icon}</span>
                      <div>
                        <p style={{ color: '#4CAF50', marginBottom: '4px' }}>
                          {insight.label}
                        </p>
                        <p style={{
                          color: 'white',
                          fontWeight: 'bold'
                        }}>
                          {insight.value}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <p style={{
                color: '#4CAF50',
                textAlign: 'center',
                fontStyle: 'italic',
                marginTop: '24px'
              }}>
                {report.courtesyText}
              </p>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={() => navigation.navigate('Home')}
        style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          backgroundColor: 'transparent',
          color: '#4CAF50',
          padding: '10px',
          borderRadius: '8px',
          border: '1px solid #4CAF50',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <IoHome size={24} />
      </button>
    </div>
  );
};

export default StatsPage;
