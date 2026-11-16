import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Share,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useMobileApp } from '../../context/MobileAppContext';
import { MobileHeader } from '../../components/common/MobileHeader';
import { CardContainer } from '../../components/common/CardContainer';
import { StatusBadge } from '../../components/common/StatusBadge';
import { ActionButton } from '../../components/common/ActionButton';
import { ConsultationSession, SOAPNote } from '../../types';

interface Props {
  route?: any;
  navigation: any;
}

export const ClinicalNoteReviewScreen: React.FC<Props> = ({ route, navigation }) => {
  const { activeConsultation, approveNote } = useMobileApp();
  const session: ConsultationSession = route?.params?.consultation || activeConsultation;

  const [activeTab, setActiveTab] = useState<'soap' | 'transcript' | 'rx'>('soap');

  const effectiveNote = session?.note || session?.soapNote;

  if (!session || !effectiveNote) {
    return (
      <View style={styles.container}>
        <MobileHeader title="Clinical Note Review" showBack onBack={() => navigation.goBack()} />
        <View style={styles.emptyState}>
          <Ionicons name="document-text-outline" size={48} color="#94A3B8" />
          <Text style={styles.emptyTitle}>No Note Ready for Review</Text>
          <Text style={styles.emptySubtitle}>Start or complete a live consultation to review clinical documentation.</Text>
          <ActionButton
            title="Go to Live Consultation"
            onPress={() => navigation.navigate('LiveConsultation')}
            style={{ marginTop: 16 }}
          />
        </View>
      </View>
    );
  }

  const note = effectiveNote;
  const { patient, transcript, doctor } = session;
  const isApproved = session.status === 'approved' || note.status === 'approved';

  const handleApprove = () => {
    approveNote(session.id);
    Alert.alert('Note Approved', 'Clinical note finalized, digitally signed, and saved to EHR.');
  };

  const handleShare = async () => {
    const text = `PIVOT CLINICAL SOAP NOTE\nPatient: ${patient.firstName} ${patient.lastName} (${patient.patientCode})\nAttending Doctor: ${doctor.name}\nDate: ${session.date}\n\nSUBJECTIVE:\nChief Complaint: ${note.subjective.chiefComplaint}\nHPI: ${note.subjective.historyOfPresentIllness}\n\nOBJECTIVE:\n${note.objective.findings.join('\n')}\n\nASSESSMENT:\n${note.assessment.clinicalImpression}\n\nPLAN & PRESCRIPTIONS:\n${note.plan.prescriptions.join('\n')}\nFollow-up: ${note.plan.followUp}`;
    try {
      await Share.share({ message: text, title: `Clinical Note - ${patient.firstName}` });
    } catch {}
  };

  return (
    <View style={styles.container}>
      <MobileHeader
        title="Clinical Note Review"
        subtitle={`${patient.firstName} ${patient.lastName} (${patient.patientCode})`}
        showBack
        onBack={() => navigation.goBack()}
        rightAction={
          <TouchableOpacity onPress={handleShare} style={styles.shareIconBtn}>
            <Ionicons name="share-outline" size={20} color="#2563EB" />
          </TouchableOpacity>
        }
      />

      {/* Patient & Approval Status Header */}
      <View style={styles.statusHeader}>
        <View>
          <Text style={styles.patientFullName}>
            {patient.firstName} {patient.lastName}
          </Text>
          <Text style={styles.visitReasonText}>{session.reasonForVisit}</Text>
        </View>
        <StatusBadge status={isApproved ? 'Approved' : 'Review Required'} />
      </View>

      {/* Segmented Tab Bar */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'soap' && styles.tabItemActive]}
          onPress={() => setActiveTab('soap')}
        >
          <Ionicons
            name="document-text"
            size={16}
            color={activeTab === 'soap' ? '#2563EB' : '#64748B'}
          />
          <Text style={[styles.tabText, activeTab === 'soap' && styles.tabTextActive]}>
            SOAP Note
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'transcript' && styles.tabItemActive]}
          onPress={() => setActiveTab('transcript')}
        >
          <Ionicons
            name="chatbubbles"
            size={16}
            color={activeTab === 'transcript' ? '#2563EB' : '#64748B'}
          />
          <Text style={[styles.tabText, activeTab === 'transcript' && styles.tabTextActive]}>
            Transcript ({transcript.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'rx' && styles.tabItemActive]}
          onPress={() => setActiveTab('rx')}
        >
          <Ionicons
            name="medical"
            size={16}
            color={activeTab === 'rx' ? '#2563EB' : '#64748B'}
          />
          <Text style={[styles.tabText, activeTab === 'rx' && styles.tabTextActive]}>
            Rx Draft
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.contentScroll}>
        {/* TAB 1: SOAP Note */}
        {activeTab === 'soap' && (
          <View>
            {/* Conversation Purpose & Clinical Summary */}
            {note.conversationSummary && (
              <CardContainer style={styles.summaryCard}>
                <View style={styles.sectionHeader}>
                  <Ionicons name="sparkles" size={16} color="#2563EB" />
                  <Text style={styles.sectionTitle}>Conversation Summary</Text>
                </View>
                <Text style={styles.summaryText}>{note.conversationSummary}</Text>
              </CardContainer>
            )}

            {/* SUBJECTIVE */}
            <CardContainer style={styles.soapCard}>
              <View style={[styles.soapPill, { backgroundColor: '#EFF6FF', borderColor: '#BFDBFE' }]}>
                <Text style={[styles.soapPillText, { color: '#1D4ED8' }]}>S · Subjective</Text>
              </View>

              <Text style={styles.fieldLabel}>Chief Complaint:</Text>
              <Text style={styles.fieldValue}>{note.subjective.chiefComplaint}</Text>

              <Text style={styles.fieldLabel}>History of Present Illness (HPI):</Text>
              <Text style={styles.fieldValue}>{note.subjective.historyOfPresentIllness}</Text>

              {note.subjective.negativeSymptoms.length > 0 && (
                <>
                  <Text style={styles.fieldLabel}>Pertinent Negatives:</Text>
                  {note.subjective.negativeSymptoms.map((neg, idx) => (
                    <Text key={idx} style={styles.bulletItem}>• {neg}</Text>
                  ))}
                </>
              )}
            </CardContainer>

            {/* OBJECTIVE */}
            <CardContainer style={styles.soapCard}>
              <View style={[styles.soapPill, { backgroundColor: '#F0FDF4', borderColor: '#BBF7D0' }]}>
                <Text style={[styles.soapPillText, { color: '#15803D' }]}>O · Objective</Text>
              </View>

              <Text style={styles.fieldLabel}>Clinical Physical Examination:</Text>
              {note.objective.findings.map((f, idx) => (
                <Text key={idx} style={styles.bulletItem}>• {f}</Text>
              ))}
            </CardContainer>

            {/* ASSESSMENT */}
            <CardContainer style={styles.soapCard}>
              <View style={[styles.soapPill, { backgroundColor: '#FEF3C7', borderColor: '#FDE68A' }]}>
                <Text style={[styles.soapPillText, { color: '#B45309' }]}>A · Assessment</Text>
              </View>

              <Text style={styles.fieldLabel}>Clinical Impression:</Text>
              <Text style={styles.fieldValue}>{note.assessment.clinicalImpression}</Text>

              <Text style={styles.fieldLabel}>Differential Diagnosis:</Text>
              {note.assessment.differentialDiagnosis.map((d, idx) => (
                <Text key={idx} style={styles.bulletItem}>• {d}</Text>
              ))}
            </CardContainer>

            {/* PLAN */}
            <CardContainer style={styles.soapCard}>
              <View style={[styles.soapPill, { backgroundColor: '#F5F3FF', borderColor: '#DDD6FE' }]}>
                <Text style={[styles.soapPillText, { color: '#7C3AED' }]}>P · Plan & Rx</Text>
              </View>

              <Text style={styles.fieldLabel}>Prescriptions:</Text>
              {note.plan.prescriptions.map((rx, idx) => (
                <Text key={idx} style={styles.bulletItem}>• {rx}</Text>
              ))}

              <Text style={styles.fieldLabel}>Follow-up Instructions:</Text>
              <Text style={styles.fieldValue}>{note.plan.followUp}</Text>
            </CardContainer>
          </View>
        )}

        {/* TAB 2: Verbatim Transcript Dialogue */}
        {activeTab === 'transcript' && (
          <View>
            <CardContainer style={styles.unifiedCard}>
              <View style={styles.unifiedHeader}>
                <Ionicons name="document-text" size={16} color="#2563EB" />
                <Text style={styles.unifiedTitle}>Unified Consultation Paragraph</Text>
              </View>
              <Text style={styles.unifiedParagraph}>
                {transcript.map((t) => `${t.speaker}: ${t.originalText || t.text}`).join('  ')}
              </Text>
            </CardContainer>

            <Text style={styles.turnByTurnHeader}>Turn-by-Turn Dialogue (Attributed)</Text>
            {transcript.map((msg, idx) => {
              const isDoc = msg.speaker === 'Doctor';
              return (
                <CardContainer key={msg.id || idx} style={styles.turnCard}>
                  <View style={styles.turnHeader}>
                    <View style={[styles.speakerBadge, isDoc ? styles.docBadge : styles.patBadge]}>
                      <Text style={[styles.speakerBadgeText, isDoc ? styles.docBadgeText : styles.patBadgeText]}>
                        {msg.speaker}
                      </Text>
                    </View>
                    <Text style={styles.turnTime}>{msg.timestamp}</Text>
                  </View>
                  <Text style={styles.turnText}>{msg.originalText || msg.text}</Text>
                </CardContainer>
              );
            })}
          </View>
        )}

        {/* TAB 3: Prescription Draft Candidates */}
        {activeTab === 'rx' && (
          <View>
            {(note.prescriptionDraft || []).length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptySubtitle}>No new prescriptions drafted for this visit.</Text>
              </View>
            ) : (
              (note.prescriptionDraft || []).map((rx, idx) => (
                <CardContainer key={idx} style={styles.rxCard}>
                  <View style={styles.rxHeader}>
                    <Text style={styles.rxName}>{rx.name}</Text>
                    <StatusBadge status={rx.route || 'Oral (PO)'} variant="info" />
                  </View>
                  <View style={styles.rxDetailGrid}>
                    <View style={styles.rxDetailItem}>
                      <Text style={styles.rxDetailLabel}>Dosage</Text>
                      <Text style={styles.rxDetailValue}>{rx.dose || '650 mg'}</Text>
                    </View>
                    <View style={styles.rxDetailItem}>
                      <Text style={styles.rxDetailLabel}>Frequency</Text>
                      <Text style={styles.rxDetailValue}>{rx.frequency || 'TDS'}</Text>
                    </View>
                    <View style={styles.rxDetailItem}>
                      <Text style={styles.rxDetailLabel}>Duration</Text>
                      <Text style={styles.rxDetailValue}>{rx.duration || '3 days'}</Text>
                    </View>
                  </View>
                  <Text style={styles.rxInstructions}>
                    Instructions: {rx.instructions || 'Take after meals as instructed.'}
                  </Text>
                </CardContainer>
              ))
            )}
          </View>
        )}
      </ScrollView>

      {/* Bottom Sticky Action Bar */}
      <View style={styles.bottomBar}>
        {isApproved ? (
          <View style={styles.approvedBanner}>
            <Ionicons name="checkmark-done-circle" size={20} color="#15803D" />
            <Text style={styles.approvedText}>
              Note Approved by {note.approvedBy || doctor.name}
            </Text>
          </View>
        ) : (
          <ActionButton
            title="Approve & Finalize Note"
            icon="checkmark-done"
            variant="success"
            onPress={handleApprove}
            style={styles.approveBtn}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EFF4FA',
  },
  shareIconBtn: {
    padding: 6,
    borderRadius: 10,
    backgroundColor: '#EFF6FF',
  },
  statusHeader: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  patientFullName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  visitReasonText: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  tabItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 6,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabItemActive: {
    borderBottomColor: '#2563EB',
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  tabTextActive: {
    color: '#2563EB',
    fontWeight: '800',
  },
  contentScroll: {
    padding: 16,
    paddingBottom: 32,
  },
  summaryCard: {
    backgroundColor: '#EFF6FF',
    borderColor: '#BFDBFE',
    marginBottom: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1E293B',
  },
  summaryText: {
    fontSize: 13,
    color: '#334155',
    lineHeight: 18,
  },
  soapCard: {
    marginBottom: 12,
  },
  soapPill: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 10,
  },
  soapPillText: {
    fontSize: 12,
    fontWeight: '800',
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
    marginTop: 8,
    marginBottom: 2,
  },
  fieldValue: {
    fontSize: 13,
    color: '#0F172A',
    lineHeight: 18,
  },
  bulletItem: {
    fontSize: 13,
    color: '#0F172A',
    marginLeft: 4,
    marginVertical: 2,
  },
  unifiedCard: {
    marginBottom: 16,
    backgroundColor: '#F8FAFC',
  },
  unifiedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  unifiedTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  unifiedParagraph: {
    fontSize: 13,
    color: '#334155',
    lineHeight: 20,
  },
  turnByTurnHeader: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 8,
  },
  turnCard: {
    marginBottom: 8,
    padding: 12,
  },
  turnHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  speakerBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  docBadge: {
    backgroundColor: '#DBEAFE',
  },
  patBadge: {
    backgroundColor: '#DCFCE7',
  },
  speakerBadgeText: {
    fontSize: 11,
    fontWeight: '800',
  },
  docBadgeText: {
    color: '#1D4ED8',
  },
  patBadgeText: {
    color: '#15803D',
  },
  turnTime: {
    fontSize: 11,
    color: '#64748B',
  },
  turnText: {
    fontSize: 13,
    color: '#0F172A',
    lineHeight: 18,
  },
  rxCard: {
    marginBottom: 10,
  },
  rxHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  rxName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  rxDetailGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 8,
  },
  rxDetailItem: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  rxDetailLabel: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '600',
  },
  rxDetailValue: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 2,
  },
  rxInstructions: {
    fontSize: 12,
    color: '#475569',
    fontStyle: 'italic',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1E293B',
    marginTop: 12,
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 4,
  },
  bottomBar: {
    backgroundColor: '#FFFFFF',
    padding: 14,
    paddingBottom: 24,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  approveBtn: {
    borderRadius: 14,
    paddingVertical: 14,
  },
  approvedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#DCFCE7',
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#86EFAC',
    gap: 8,
  },
  approvedText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#15803D',
  },
});

