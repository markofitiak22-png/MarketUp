export type Language = 'en' | 'ar' | 'sv' | 'tr' | 'uk';

export interface Translations {
  // Navigation
  home: string;
  studio: string;
  pricing: string;
  about: string;
  contact: string;
  referrals: string;
  
  // Hero Section
  heroTitle: string;
  heroSubtitle: string;
  getStarted: string;
  seePricing: string;
  
  // Trust indicators
  noCreditCard: string;
  fiveMinuteSetup: string;
  hdQuality: string;
  
  // How it works
  howItWorks: string;
  howItWorksSubtitle: string;
  step1Title: string;
  step1Description: string;
  step2Title: string;
  step2Description: string;
  step3Title: string;
  step3Description: string;
  step4Title: string;
  step4Description: string;
  
  // Preview Section
  seeItInAction: string;
  previewSubtitle: string;
  lightningFast: string;
  lightningFastDesc: string;
  hdQualityTitle: string;
  hdQualityDesc: string;
  autoPublishing: string;
  autoPublishingDesc: string;
  
  // Pricing Section
  simplePricing: string;
  pricingSubtitle: string;
  seePricingButton: string;
  startNow: string;
  
  // Account Menu
  account: string;
  dashboard: string;
  profile: string;
  myVideos: string;
  subscription: string;
  settings: string;
  adminPanel: string;
  signOut: string;
  
  // Footer
  footerTitle: string;
  footerSubtitle: string;
  footerGetStarted: string;
  footerFollowUs: string;
  footerInstagram: string;
  footerFacebook: string;
  footerTikTok: string;
  footerCopyright: string;
  footerContact: string;
  footerPrivacy: string;
  footerTerms: string;
  footerCookies: string;
  
  // Studio Page
  studioAccessDenied: string;
  studioSignInRequired: string;
  studioSignIn: string;
  studioStep: string;
  studioOf: string;
  studioChooseAvatar: string;
  studioSelectPresenter: string;
  studioLanguageVoice: string;
  studioPickLanguage: string;
  studioBackgrounds: string;
  studioChooseScenes: string;
  studioScript: string;
  studioWriteMessage: string;
  studioGenerate: string;
  studioCreateVideo: string;
  studioPreview: string;
  studioReviewDownload: string;
  
  // Onboarding Page
  onboardingWelcome: string;
  onboardingGetStarted: string;
  onboardingSetupTime: string;
  onboardingPersonalize: string;
  onboardingPersonalizeDesc: string;
  onboardingConfigure: string;
  onboardingConfigureDesc: string;
  onboardingCreate: string;
  onboardingCreateDesc: string;
  onboardingStep: string;
  onboardingOf: string;
  onboardingWhereLocated: string;
  onboardingLocationDesc: string;
  onboardingWhatLanguage: string;
  onboardingLanguageDesc: string;
  onboardingBack: string;
  onboardingContinue: string;
  onboardingSkip: string;
  onboardingCompleteSetup: string;
  onboardingSettingUp: string;
  onboardingError: string;
  
  // Referrals Page
  referralsCreateCode: string;
  referralsGenerateLink: string;
  referralsYourUserId: string;
  referralsUserIdPlaceholder: string;
  referralsGenerating: string;
  referralsGenerate: string;
  referralsCodeReady: string;
  referralsYourCode: string;
  referralsCopyLink: string;
  referralsShareLink: string;
  referralsRedeemCode: string;
  referralsEnterCode: string;
  referralsCode: string;
  referralsCodePlaceholder: string;
  referralsRedeeming: string;
  referralsRedeem: string;
  referralsSuccess: string;
  referralsWelcome: string;
  referralsInvalidCode: string;
  referralsNetworkError: string;
  referralsProvideUserId: string;
  referralsEnterCodeToRedeem: string;
  referralsHowReferralsWork: string;
  referralsStartEarning: string;
  referralsGenerateStep: string;
  referralsGenerateDesc: string;
  referralsShareStep: string;
  referralsShareDesc: string;
  referralsEarnStep: string;
  referralsEarnDesc: string;
  referralsStep: string;
  
  // Contact Page
  contactHearFromYou: string;
  contactQuestionsPartnerships: string;
  contactResponseTime: string;
  contact24hResponse: string;
  contactExpertSupport: string;
  contactNoSpam: string;
  contactGetInTouch: string;
  contactSendMessage: string;
  contactThanksMessage: string;
  contactResponseTimeDesc: string;
  contactSendAnother: string;
  contactName: string;
  contactNamePlaceholder: string;
  contactEmail: string;
  contactEmailPlaceholder: string;
  contactMessage: string;
  contactMessagePlaceholder: string;
  contactNoBotsSpam: string;
  contactFillAllFields: string;
  contactValidEmail: string;
  contactMessageLength: string;
  contactSending: string;
  contactSendMessage: string;
  contactClear: string;
  contactSomethingWrong: string;
  contactOtherWays: string;
  contactBusinessHours: string;
  contactBusinessHoursDesc: string;
  contactResponseTimeLabel: string;
  contactResponseTimeValue: string;
  contactEmailSupport: string;
  contactGetHelpEmail: string;
  contactOnlineNow: string;
  contactEmailDescription: string;
  contactEmailButton: string;
  contactEmailSupportMobile: string;
  contact24hResponseLabel: string;
  contactExpertSupportLabel: string;
  contactWhatsAppSupport: string;
  contactComingSoon: string;
  contactInDevelopment: string;
  contactWhatsAppDescription: string;
  contactWhatsAppButton: string;
  contactWhatsAppMobile: string;
  contactInstantChat: string;
  contactFrequentlyAsked: string;
  contactQuestions: string;
  contactQuickAnswers: string;
  contactAIVideoPlatform: string;
  contactHowLong: string;
  contactHowLongDesc: string;
  contactUnder5Minutes: string;
  contactHDQuality: string;
  contactVideoQuality: string;
  contactVideoQualityDesc: string;
  contact1080pHD: string;
  contactMultipleFormats: string;
  contactCustomVoice: string;
  contactCustomVoiceDesc: string;
  contactComingSoonLabel: string;
  contactAIVoicesNow: string;
  contactCommercialUse: string;
  contactCommercialUseDesc: string;
  contactCommercialRights: string;
  contactNoExtraFees: string;
  
  // Pricing Page
  pricingTransparentPricing: string;
  pricingSimpleTransparent: string;
  pricingChoosePerfectPlan: string;
  pricingNoHiddenFees: string;
  pricingMonthly: string;
  pricingYearly: string;
  pricingSave20: string;
  pricingFree: string;
  pricingPro: string;
  pricingEnterprise: string;
  pricingPerfectForGettingStarted: string;
  pricingBestForProfessionals: string;
  pricingForTeamsOrganizations: string;
  pricingMostPopular: string;
  pricingEnterpriseBadge: string;
  pricingGetStartedFree: string;
  pricingStartProTrial: string;
  pricingContactSales: string;
  pricing3VideosPerMonth: string;
  pricingStandardQuality720p: string;
  pricingBasicAvatars: string;
  pricing5Languages: string;
  pricingCommunitySupport: string;
  pricingWatermarkOnVideos: string;
  pricing50VideosPerMonth: string;
  pricingHDQuality1080p: string;
  pricingAllAvatarsVoices: string;
  pricing20PlusLanguages: string;
  pricingPrioritySupport: string;
  pricingNoWatermark: string;
  pricingCustomBackgrounds: string;
  pricingAdvancedEditingTools: string;
  pricingAPIAccess: string;
  pricingUnlimitedVideos: string;
  pricing4KQuality2160p: string;
  pricingCustomAvatars: string;
  pricingAllLanguagesVoices: string;
  pricingDedicatedSupport: string;
  pricingCustomBranding: string;
  pricingTeamCollaboration: string;
  pricingAdvancedAnalytics: string;
  pricingWhiteLabelSolution: string;
  pricingCustomIntegrations: string;
  pricingSLAGuarantee: string;
  pricingFeatureComparison: string;
  pricingCompareAllFeatures: string;
  pricingEverythingYouNeed: string;
  pricingFeatures: string;
  pricingVideoCreation: string;
  pricingAvatarsVoices: string;
  pricingSupport: string;
  pricingVideosPerMonth: string;
  pricingVideoQuality: string;
  pricingVideoDuration: string;
  pricingExportFormats: string;
  pricingAvailableAvatars: string;
  pricingVoiceOptions: string;
  pricingVoiceQuality: string;
  pricingCustomVoices: string;
  pricingBackgroundOptions: string;
  pricingEmailSupport: string;
  pricingFrequentlyAsked: string;
  pricingQuestions: string;
  pricingEverythingYouNeedToKnow: string;
  pricingCanChangePlanAnytime: string;
  pricingCanChangePlanAnytimeAnswer: string;
  pricingWhatHappensToVideos: string;
  pricingWhatHappensToVideosAnswer: string;
  pricingDoYouOfferRefunds: string;
  pricingDoYouOfferRefundsAnswer: string;
  pricingCanCancelSubscription: string;
  pricingCanCancelSubscriptionAnswer: string;
  pricingCustomEnterpriseSolutions: string;
  pricingCustomEnterpriseSolutionsAnswer: string;
  pricingGetStarted: string;
  pricingReadyToCreate: string;
  pricingJoinThousands: string;
  pricingStartFreeTrial: string;
  pricingContactSales: string;
  pricingSavePerYear: string;
  pricingForever: string;
  pricingMonth: string;
  pricingYear: string;
  
  // Studio Wizard Components
  studioChooseAvatar: string;
  studioSelectPresenter: string;
  studioLanguageVoice: string;
  studioPickLanguage: string;
  studioBackgrounds: string;
  studioChooseScenes: string;
  studioScript: string;
  studioWriteMessage: string;
  studioGenerate: string;
  studioCreateVideo: string;
  studioPreview: string;
  studioReviewDownload: string;
  studioStep: string;
  studioOf: string;
  studioAccessDenied: string;
  studioSignInRequired: string;
  studioSignIn: string;
  
  // Avatar Step
  studioChooseYourAvatar: string;
  studioSelectVirtualPresenter: string;
  studioEachAvatarUnique: string;
  studioPreview: string;
  studioWillPresentVideo: string;
  studioContinue: string;
  
  // Language Step
  studioLanguageVoice: string;
  studioChooseLanguageVoice: string;
  studioPreviewEachVoice: string;
  studioSelectLanguage: string;
  studioChooseVoice: string;
  studioAllTones: string;
  studioProfessional: string;
  studioEnergetic: string;
  studioCalm: string;
  studioExpressive: string;
  studioPlaying: string;
  studioPreview: string;
  studioSelectedVoice: string;
  studioBack: string;
  studioContinue: string;
  
  // Background Step
  studioChooseBackgrounds: string;
  studioSelectMultipleBackgrounds: string;
  studioChoose2To4Scenes: string;
  studioAll: string;
  studioProfessional: string;
  studioCasual: string;
  studioCreative: string;
  studioBackgroundsSelected: string;
  studioPreview: string;
  studioPreviewMode: string;
  studioExitPreview: string;
  studioSelectedBackgrounds: string;
  studioMoreBackgrounds: string;
  studioBack: string;
  studioContinue: string;
  
  // Text Step
  studioWriteYourScript: string;
  studioWriteTextAvatarSpeak: string;
  studioStartWithTemplate: string;
  studioQuickTemplates: string;
  studioWelcomeMessage: string;
  studioProductIntroduction: string;
  studioTrainingIntroduction: string;
  studioCompanyAnnouncement: string;
  studioTutorialIntroduction: string;
  studioSpecialOffer: string;
  studioBusiness: string;
  studioMarketing: string;
  studioEducation: string;
  studioYourScript: string;
  studioWords: string;
  studioCharacters: string;
  studioDuration: string;
  studioShort: string;
  studioMedium: string;
  studioLong: string;
  studioWriteScriptHere: string;
  studioWritingTips: string;
  studioNaturalSpeech: string;
  studioWriteAsYouSpeak: string;
  studioOptimalLength: string;
  studioKeepVideos30To120: string;
  studioClearStructure: string;
  studioStartWithHook: string;
  studioPronunciation: string;
  studioUsePhoneticSpelling: string;
  studioPreview: string;
  studioBack: string;
  studioContinue: string;
  
  // Generation Step
  studioGenerateYourVideo: string;
  studioCreatePersonalizedVideo: string;
  studioProcessTakes2To3Minutes: string;
  studioVideoSummary: string;
  studioAvatar: string;
  studioBackground: string;
  studioDuration: string;
  studioWords: string;
  studioGeneratingYourVideo: string;
  studioDontCloseWindow: string;
  studioProgress: string;
  studioPreparingAssets: string;
  studioGeneratingAvatarAnimation: string;
  studioSynthesizingVoice: string;
  studioProcessingBackground: string;
  studioCompositingVideo: string;
  studioFinalizingOutput: string;
  studioComplete: string;
  studioProcessing: string;
  studioEstimatedTimeRemaining: string;
  studioCancelGeneration: string;
  studioReadyToGenerate: string;
  studioVideoCreatedWithSettings: string;
  studioStartGeneration: string;
  studioBack: string;
  studioGenerationTakes2To3Minutes: string;
  
  // Preview Step
  studioYourVideoReady: string;
  studioReviewGeneratedVideo: string;
  studioDownloadWhenSatisfied: string;
  studioPlaying: string;
  studioClickToPreview: string;
  studioDuration: string;
  studioQuality: string;
  studioFormat: string;
  studioFileSize: string;
  studioVideoSettings: string;
  studioVoice: string;
  studioBackground: string;
  studioResolution: string;
  studioScriptLength: string;
  studioScript: string;
  studioActions: string;
  studioDownloading: string;
  studioDownloadVideo: string;
  studioRegenerate: string;
  studioSaveContinue: string;
  studioDownloadProgress: string;
  studioBack: string;
  studioVideoGeneratedSuccessfully: string;
  
  // About Page
  aboutTitle: string;
  aboutWelcome: string;
  aboutEasilyAffordably: string;
  aboutEuropeanPlatform: string;
  aboutForEveryone: string;
  aboutEasyAffordable: string;
  aboutOurMissionVision: string;
  aboutDrivingInnovation: string;
  aboutEveryone: string;
  aboutOurMission: string;
  aboutMissionText: string;
  aboutOurVision: string;
  aboutVisionText: string;
  aboutWhatMakesDifferent: string;
  aboutDifferentText: string;
  aboutSimplicityQualityAccessibility: string;
  aboutWhatMarketUpOffers: string;
  aboutComprehensiveSolutions: string;
  aboutMarketingNeeds: string;
  aboutSmartAIVideo: string;
  aboutForMarketing: string;
  aboutAffordablePricing: string;
  aboutSuitableForAll: string;
  aboutMultilingualSupport: string;
  aboutLanguages: string;
  aboutEasyToUse: string;
  aboutMakeVideoMarketing: string;
  aboutActive: string;
  aboutOurCommitment: string;
  aboutCommitmentText: string;
  aboutQuote: string;
  aboutOurSlogans: string;
  aboutSlogan: string;
  aboutSloganText: string;
  aboutTagline: string;
  aboutTaglineText: string;
  aboutReadyToTransform: string;
  aboutMarketing: string;
  aboutJoinThousands: string;
  aboutGetStarted: string;
  aboutSeePricing: string;
  
  // Dashboard Page
  dashboardWelcomeBack: string;
  dashboardCreator: string;
  dashboardTotalVideos: string;
  dashboardThisMonth: string;
  dashboardCurrentPlan: string;
  dashboardFreePlan: string;
  dashboardUpgradeToPro: string;
  dashboardStorageUsed: string;
  dashboardOfUsed: string;
  dashboardCompleted: string;
  dashboardReadyToView: string;
  dashboardProcessing: string;
  dashboardInProgress: string;
  dashboardTotalViews: string;
  dashboardAllTime: string;
  dashboardDownloads: string;
  dashboardQuickActions: string;
  dashboardCreateVideo: string;
  dashboardStartNewProject: string;
  dashboardMyVideos: string;
  dashboardViewAllVideos: string;
  dashboardUpgradePlan: string;
  dashboardManageSubscription: string;
  dashboardSettings: string;
  dashboardAccountPreferences: string;
  dashboardRecentVideos: string;
  dashboardViewAll: string;
  dashboardViews: string;
  dashboardNoVideosYet: string;
  dashboardCreateFirstVideo: string;
  
  // Profile Page
  profileAnonymousUser: string;
  profileNotSet: string;
  profileCancel: string;
  profileEditProfile: string;
  profilePersonalInformation: string;
  profileFullName: string;
  profileEnterFullName: string;
  profileEmailAddress: string;
  profileEnterEmail: string;
  profileEmailCannotBeChanged: string;
  profileBio: string;
  profileTellAboutYourself: string;
  profileCountry: string;
  profileSelectCountry: string;
  profileLanguage: string;
  profileSelectLanguage: string;
  profileCompany: string;
  profileCompanyName: string;
  profileWebsite: string;
  profileWebsiteUrl: string;
  profileSaving: string;
  profileSaveChanges: string;
  profileProfileStats: string;
  profileProfileCompletion: string;
  profileVideos: string;
  profileProjects: string;
  profileAccountSettings: string;
  profileChangePassword: string;
  profileUpdatePassword: string;
  profileTwoFactorAuth: string;
  profileAddExtraSecurity: string;
  profileDeleteAccount: string;
  profilePermanentlyDeleteAccount: string;
  
  // Videos Page
  videosMyVideos: string;
  videosManageViewAll: string;
  videosCreateNewVideo: string;
  videosSearchVideos: string;
  videosAll: string;
  videosCompleted: string;
  videosProcessing: string;
  videosQueued: string;
  videosLoadingVideos: string;
  videosStatus: string;
  videosDuration: string;
  videosViews: string;
  videosDownloads: string;
  videosView: string;
  videosEdit: string;
  videosDownload: string;
  videosShare: string;
  videosDuplicate: string;
  videosDelete: string;
  videosProcessingStatus: string;
  videosNoVideosFound: string;
  videosTryAdjustingSearch: string;
  videosCreateFirstVideo: string;
  videosCreateVideo: string;
  videosPage: string;
  videosOf: string;
  videosPrevious: string;
  videosPrev: string;
  videosNext: string;
  videosDownloadFunctionalityComingSoon: string;
  videosShareFunctionalityComingSoon: string;
  videosDeleteFunctionalityComingSoon: string;
  videosDuplicateFunctionalityComingSoon: string;
  videosAreYouSureDelete: string;
  
  // Subscription Page
  subscriptionManagement: string;
  subscriptionManageBillingUpgrade: string;
  subscriptionCurrentPlan: string;
  subscriptionManageSubscriptionBilling: string;
  subscriptionCancelling: string;
  subscriptionEnds: string;
  subscriptionNextBilling: string;
  subscriptionUsageThisMonth: string;
  subscriptionVideosCreated: string;
  subscriptionUsed: string;
  subscriptionChangePlan: string;
  subscriptionUpdatePayment: string;
  subscriptionCancelSubscription: string;
  subscriptionReactivate: string;
  subscriptionUpgradePlan: string;
  subscriptionAvailablePlans: string;
  subscriptionChoosePlanBestFits: string;
  subscriptionMostPopular: string;
  subscriptionChoosePlan: string;
  subscriptionBillingHistory: string;
  subscriptionTrackPaymentHistory: string;
  subscriptionDownload: string;
  subscriptionNoBillingHistory: string;
  subscriptionBillingHistoryWillAppear: string;
  subscriptionErrorLoadingData: string;
  subscriptionPleaseTryRefreshing: string;
  subscriptionRefreshPage: string;
  subscriptionChangePlanFunctionalityComingSoon: string;
  subscriptionUpdatePaymentFunctionalityComingSoon: string;
  subscriptionCancelSubscriptionFunctionalityComingSoon: string;
  subscriptionUpgradePlanFunctionalityComingSoon: string;
  subscriptionDownloadInvoiceFunctionalityComingSoon: string;
  subscriptionUpgradeToPlanFunctionalityComingSoon: string;
  
  // Billing Page
  billingInvoices: string;
  billingManageBillingInformation: string;
  billingOverview: string;
  billingPaymentMethods: string;
  billingUsage: string;
  billingErrorLoadingData: string;
  billingPleaseTryRefreshing: string;
  billingRefreshPage: string;
  billingCurrentBillingPeriod: string;
  billingPeriod: string;
  billingCurrentBillingCycle: string;
  billingAmount: string;
  billingStatus: string;
  billingFreePlan: string;
  billingAutoRenewalEnabled: string;
  billingUsageThisMonth: string;
  billingVideosCreated: string;
  billingOf: string;
  billingStorageUsed: string;
  billingBandwidth: string;
  billingThisMonth: string;
  billingInvoiceHistory: string;
  billingNoInvoicesYet: string;
  billingInvoiceHistoryWillAppear: string;
  billingDownload: string;
  billingPaymentMethods: string;
  billingAddPaymentMethod: string;
  billingDefault: string;
  billingEdit: string;
  billingNoPaymentMethod: string;
  billingAddPaymentMethodToManage: string;
  billingDetailedUsage: string;
  billingVideosCreated: string;
  billingStorageUsed: string;
  billingBandwidthThisMonth: string;
  billingUnlimited: string;
  
  // Settings Page
  settingsTitle: string;
  settingsManageAccountPreferences: string;
  settingsMemberSince: string;
  settingsSaving: string;
  settingsSaveChanges: string;
  settingsAccountInformation: string;
  settingsEmail: string;
  settingsName: string;
  settingsCountry: string;
  settingsSelectCountry: string;
  settingsNotifications: string;
  settingsEmailNotifications: string;
  settingsReceiveNotificationsViaEmail: string;
  settingsPushNotifications: string;
  settingsReceivePushNotificationsInBrowser: string;
  settingsMarketingEmails: string;
  settingsReceiveUpdatesAboutNewFeatures: string;
  settingsProductUpdates: string;
  settingsGetNotifiedAboutNewFeatures: string;
  settingsPrivacySecurity: string;
  settingsProfileVisibility: string;
  settingsControlWhoCanSeeProfile: string;
  settingsPublic: string;
  settingsPrivate: string;
  settingsFriendsOnly: string;
  settingsAnalytics: string;
  settingsHelpUsImproveBySharing: string;
  settingsDataSharing: string;
  settingsAllowSharingDataWithPartners: string;
  settingsPreferences: string;
  settingsTheme: string;
  settingsDark: string;
  settingsLight: string;
  settingsAuto: string;
  settingsLanguage: string;
  settingsEnglish: string;
  settingsUkrainian: string;
  settingsSpanish: string;
  settingsFrench: string;
  settingsTimezone: string;
  settingsUTC: string;
  settingsEasternTime: string;
  settingsPacificTime: string;
  settingsLondon: string;
  settingsKiev: string;
  settingsDateFormat: string;
  settingsMMDDYYYY: string;
  settingsDDMMYYYY: string;
  settingsYYYYMMDD: string;
  settingsDangerZone: string;
  settingsExportData: string;
  settingsDownloadCopyOfData: string;
  settingsExport: string;
  settingsDeleteAccount: string;
  settingsPermanentlyDeleteAccount: string;
  settingsDeleteAccount: string;
  settingsSettingsSavedSuccessfully: string;
  settingsErrorSavingSettings: string;
  settingsDataExportFeatureComingSoon: string;
  settingsAccountDeletionFeatureComingSoon: string;
  settingsAreYouSureDeleteAccount: string;
  
  // Remember Me Settings
  rememberMeSettings: string;
  rememberMeDescription: string;
  rememberMeClearSessions: string;
  rememberMeClearSessionsDescription: string;
  rememberMeClearing: string;
  rememberMeClearAllSessions: string;
  rememberMeSessionsClearedSuccessfully: string;
  rememberMeFailedToClearSessions: string;
  rememberMeErrorOccurred: string;
  
  // Dashboard Sidebar
  dashboardSidebarTitle: string;
  dashboardSidebarWelcomeBack: string;
  dashboardSidebarOverview: string;
  dashboardSidebarProfile: string;
  dashboardSidebarVideos: string;
  dashboardSidebarSubscription: string;
  dashboardSidebarBilling: string;
  dashboardSidebarSettings: string;
  dashboardSidebarAccount: string;
  dashboardSidebarSignOut: string;
  dashboardSidebarManageAccount: string;
  
  // Admin Panel
  adminOverview: string;
  adminOverviewDescription: string;
  adminExportReport: string;
  adminRefreshing: string;
  adminRefreshData: string;
  adminTotalUsers: string;
  adminTotalRevenue: string;
  adminVideosCreated: string;
  adminActiveUsers: string;
  adminRevenueTrend: string;
  adminRevenue: string;
  adminUserActivity: string;
  adminActiveUsers: string;
  adminChartVisualizationComingSoon: string;
  adminRecentActivity: string;
  adminNoRecentActivity: string;
  adminActivityWillAppearHere: string;
  adminErrorLoadingData: string;
  adminTryAgain: string;
  adminNetworkErrorOccurred: string;
  
  // Admin Users Management
  adminUsersManagement: string;
  adminUsersManagementDescription: string;
  adminAddUser: string;
  adminSearchFilters: string;
  adminSearchUsers: string;
  adminAllStatus: string;
  adminActive: string;
  adminInactive: string;
  adminSuspended: string;
  adminAllSubscriptions: string;
  adminFree: string;
  adminBasic: string;
  adminPremium: string;
  adminEnterprise: string;
  adminSortByJoinDate: string;
  adminSortByName: string;
  adminSortByEmail: string;
  adminSortByLastActive: string;
  adminSortByVideos: string;
  adminSortByTotalSpent: string;
  adminUsersSelected: string;
  adminUserSelected: string;
  adminActivate: string;
  adminSuspend: string;
  adminDelete: string;
  adminClear: string;
  adminUser: string;
  adminStatus: string;
  adminSubscription: string;
  adminVideos: string;
  adminTotalSpent: string;
  adminLastActive: string;
  adminActions: string;
  adminShowingUsers: string;
  adminOfUsers: string;
  adminPrevious: string;
  adminNext: string;
  adminEditUser: string;
  adminName: string;
  adminEmail: string;
  adminRole: string;
  adminUserRole: string;
  adminAdminRole: string;
  adminModeratorRole: string;
  adminSaveChanges: string;
  adminCancel: string;
  adminUserUpdatedSuccessfully: string;
  adminFailedToUpdateUser: string;
  adminErrorUpdatingUser: string;
  adminAreYouSureDeleteUsers: string;
  adminUsersDeletedSuccessfully: string;
  adminFailedToDeleteUsers: string;
  adminErrorPerformingAction: string;
  adminActionComingSoon: string;
  
  // Admin Videos Management
  adminVideosModeration: string;
  adminVideosModerationDescription: string;
  adminVideosToReview: string;
  adminVideosSearchFilters: string;
  adminVideosSearch: string;
  adminVideosSearchPlaceholder: string;
  adminVideosStatus: string;
  adminVideosAllStatus: string;
  adminVideosPending: string;
  adminVideosApproved: string;
  adminVideosRejected: string;
  adminVideosSortBy: string;
  adminVideosUploadDate: string;
  adminVideosTitle: string;
  adminVideosUploader: string;
  adminVideosFlags: string;
  adminVideosOrder: string;
  adminVideosNewestFirst: string;
  adminVideosOldestFirst: string;
  adminVideosReview: string;
  adminVideosReason: string;
  adminVideosViews: string;
  adminVideosLikes: string;
  adminVideosFlagsCount: string;
  adminVideosReviewVideo: string;
  adminVideosVideoInformation: string;
  adminVideosDuration: string;
  adminVideosCategory: string;
  adminVideosUploadDate: string;
  adminVideosFlagsCount: string;
  adminVideosUploaderInformation: string;
  adminVideosDescription: string;
  adminVideosTags: string;
  adminVideosReject: string;
  adminVideosApprove: string;
  adminVideosEnterRejectionReason: string;
  adminVideosVideoPlayer: string;
  adminVideosClickToPlay: string;
  
  // Admin Scheduler Management
  adminSchedulerPublicationScheduler: string;
  adminSchedulerScheduleVideoPublications: string;
  adminSchedulerScheduleNewPost: string;
  adminSchedulerSearchFilters: string;
  adminSchedulerStatusFilter: string;
  adminSchedulerAllStatus: string;
  adminSchedulerScheduled: string;
  adminSchedulerPublished: string;
  adminSchedulerFailed: string;
  adminSchedulerCancelled: string;
  adminSchedulerSocialNetwork: string;
  adminSchedulerAllNetworks: string;
  adminSchedulerDuration: string;
  adminSchedulerCategory: string;
  adminSchedulerPublishesIn: string;
  adminSchedulerPublishNow: string;
  adminSchedulerCancel: string;
  adminSchedulerScheduleNewPost: string;
  adminSchedulerSelectVideo: string;
  adminSchedulerSelectSocialNetworks: string;
  adminSchedulerPublicationDate: string;
  adminSchedulerPublicationTime: string;
  adminSchedulerCustomMessage: string;
  adminSchedulerCustomMessageOptional: string;
  adminSchedulerCustomMessagePlaceholder: string;
  adminSchedulerCancel: string;
  adminSchedulerSchedulePost: string;
  adminSchedulerScheduling: string;
  adminSchedulerPleaseSelectVideo: string;
  adminSchedulerPleaseSelectNetwork: string;
  adminSchedulerPleaseSelectDate: string;
  adminSchedulerPleaseSelectTime: string;
  adminSchedulerPostScheduledSuccessfully: string;
  adminSchedulerFailedToSchedulePost: string;
  adminSchedulerErrorSchedulingPost: string;
  adminSchedulerFailedToCancelPost: string;
  adminSchedulerErrorCancellingPost: string;
  adminSchedulerFailedToPublishPost: string;
  adminSchedulerErrorPublishingPost: string;
  adminSchedulerOverdue: string;
  
  // Admin Payments Management
  adminPaymentsPaymentManagement: string;
  adminPaymentsViewManageTransactions: string;
  adminPaymentsTransactions: string;
  adminPaymentsSearchFilters: string;
  adminPaymentsSearch: string;
  adminPaymentsSearchPlaceholder: string;
  adminPaymentsStatus: string;
  adminPaymentsAllStatus: string;
  adminPaymentsPending: string;
  adminPaymentsCompleted: string;
  adminPaymentsFailed: string;
  adminPaymentsRefunded: string;
  adminPaymentsCancelled: string;
  adminPaymentsType: string;
  adminPaymentsAllTypes: string;
  adminPaymentsSubscription: string;
  adminPaymentsOneTime: string;
  adminPaymentsRefund: string;
  adminPaymentsUpgrade: string;
  adminPaymentsDateRange: string;
  adminPaymentsAllTime: string;
  adminPaymentsToday: string;
  adminPaymentsThisWeek: string;
  adminPaymentsThisMonth: string;
  adminPaymentsThisYear: string;
  adminPaymentsTotalRevenue: string;
  adminPaymentsCompleted: string;
  adminPaymentsPending: string;
  adminPaymentsFailed: string;
  adminPaymentsInvoice: string;
  adminPaymentsConfirm: string;
  adminPaymentsCancel: string;
  adminPaymentsRefund: string;
  adminPaymentsView: string;
  adminPaymentsTransactionDetails: string;
  adminPaymentsTransactionInformation: string;
  adminPaymentsUserInformation: string;
  adminPaymentsAdditionalInformation: string;
  adminPaymentsPlan: string;
  adminPaymentsBilling: string;
  adminPaymentsDiscount: string;
  adminPaymentsTax: string;
  adminPaymentsCancelPayment: string;
  adminPaymentsRefund: string;
  adminPaymentsConfirmPayment: string;
  adminPaymentsEnterCancellationReason: string;
  adminPaymentsEnterRefundReason: string;
  adminPaymentsFailedToConfirmPayment: string;
  adminPaymentsErrorConfirmingPayment: string;
  adminPaymentsRefundFunctionalityWouldBeImplemented: string;
  adminPaymentsErrorProcessingRefund: string;
  adminPaymentsFailedToCancelPayment: string;
  adminPaymentsErrorCancellingPayment: string;
  
  // Admin Tickets Management
  adminTicketsSupportTickets: string;
  adminTicketsManageCustomerSupport: string;
  adminTicketsTickets: string;
  adminTicketsSearchFilters: string;
  adminTicketsSearch: string;
  adminTicketsSearchPlaceholder: string;
  adminTicketsStatus: string;
  adminTicketsAllStatus: string;
  adminTicketsOpen: string;
  adminTicketsInProgress: string;
  adminTicketsResolved: string;
  adminTicketsClosed: string;
  adminTicketsPriority: string;
  adminTicketsAllPriority: string;
  adminTicketsUrgent: string;
  adminTicketsHigh: string;
  adminTicketsMedium: string;
  adminTicketsLow: string;
  adminTicketsCategory: string;
  adminTicketsAllCategories: string;
  adminTicketsTechnical: string;
  adminTicketsBilling: string;
  adminTicketsFeatureRequest: string;
  adminTicketsBugReport: string;
  adminTicketsGeneral: string;
  adminTicketsSubscription: string;
  adminTicketsAllSubscriptions: string;
  adminTicketsPremium: string;
  adminTicketsEnterprise: string;
  adminTicketsTotalTickets: string;
  adminTicketsOpen: string;
  adminTicketsInProgress: string;
  adminTicketsResolved: string;
  adminTicketsUrgent: string;
  adminTicketsView: string;
  adminTicketsAssignedTo: string;
  adminTicketsMessages: string;
  adminTicketsTicketInformation: string;
  adminTicketsUserInformation: string;
  adminTicketsDescription: string;
  adminTicketsConversation: string;
  adminTicketsAssignToMe: string;
  adminTicketsTypeYourResponse: string;
  adminTicketsSend: string;
  adminTicketsFailedToSendMessage: string;
  adminTicketsErrorSendingMessage: string;
  adminTicketsFailedToUpdateStatus: string;
  adminTicketsErrorUpdatingStatus: string;
  adminTicketsFailedToAssignTicket: string;
  adminTicketsErrorAssigningTicket: string;
  adminTicketsJustNow: string;
  adminTicketsHoursAgo: string;
  adminTicketsDaysAgo: string;

  // Admin Sidebar
  adminSidebarDashboard: string;
  adminSidebarUsers: string;
  adminSidebarVideoModeration: string;
  adminSidebarPublicationScheduler: string;
  adminSidebarPaymentManagement: string;
  adminSidebarTicketSystem: string;
  adminSidebarAdminPanel: string;
  adminSidebarManagePlatform: string;
  adminSidebarSignOut: string;

  // Admin Header
  adminHeaderDashboard: string;
  adminHeaderUsers: string;
  adminHeaderVideoModeration: string;
  adminHeaderPublicationScheduler: string;
  adminHeaderPaymentManagement: string;
  adminHeaderTicketSystem: string;
  adminHeaderAdminPanel: string;
  adminHeaderManagePlatform: string;
  adminHeaderSearch: string;
  adminHeaderSearchPlaceholder: string;
  adminHeaderNotifications: string;
  adminHeaderNewUserRegistered: string;
  adminHeaderVideoProcessingCompleted: string;
  adminHeaderSystemBackupCompleted: string;
  adminHeaderMinutesAgo: string;
  adminHeaderHourAgo: string;
  adminHeaderAdminUser: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    // Navigation
    home: "Home",
    studio: "Studio",
    pricing: "Pricing",
    about: "About",
    contact: "Contact",
    referrals: "Referrals",
    
    // Hero Section
    heroTitle: "Create premium AI avatar videos in under 5 minutes.",
    heroSubtitle: "For cafes, restaurants, stores, and creators. Elegant, futuristic, simple.",
    getStarted: "Get started",
    seePricing: "See pricing",
    
    // Trust indicators
    noCreditCard: "No credit card required",
    fiveMinuteSetup: "5-minute setup",
    hdQuality: "HD quality videos",
    
    // How it works
    howItWorks: "How it works",
    howItWorksSubtitle: "Create professional marketing videos in just 4 simple steps",
    step1Title: "Write your script",
    step1Description: "Write a short script or paste your product pitch. Our AI will optimize it for video.",
    step2Title: "Choose avatar & backgrounds",
    step2Description: "Pick an avatar and set 2-4 backgrounds that match your brand and message.",
    step3Title: "Add visual elements",
    step3Description: "Add product, device, or food images for visual moments that engage your audience.",
    step4Title: "Export & share",
    step4Description: "Export a video with subtle logo overlay and your contact info ready to share.",
    
    // Preview Section
    seeItInAction: "See it in action",
    previewSubtitle: "Watch how easy it is to create professional marketing videos",
    lightningFast: "Lightning Fast",
    lightningFastDesc: "Generate in under 5 minutes",
    hdQualityTitle: "HD Quality",
    hdQualityDesc: "Professional 4K videos",
    autoPublishing: "Auto Publishing",
    autoPublishingDesc: "Direct to social media",
    
    // Pricing Section
    simplePricing: "Simple pricing",
    pricingSubtitle: "Simple plans for creators and businesses. See full details on the pricing page.",
    seePricingButton: "See pricing",
    startNow: "Start now",
    
    // Account Menu
    account: "Account",
    dashboard: "Dashboard",
    profile: "Profile",
    myVideos: "My Videos",
    subscription: "Subscription",
    settings: "Settings",
    adminPanel: "Admin Panel",
    signOut: "Sign out",
    
    // Footer
    footerTitle: "Ready to create amazing videos?",
    footerSubtitle: "Join thousands of creators using MarketUp",
    footerGetStarted: "Get Started",
    footerFollowUs: "Follow us:",
    footerInstagram: "Instagram",
    footerFacebook: "Facebook",
    footerTikTok: "TikTok",
    footerCopyright: "©️ 2026 MarketUp. All rights reserved.",
    footerContact: "Contact:",
    footerPrivacy: "Privacy",
    footerTerms: "Terms",
    footerCookies: "Cookies",
    
    // Studio Page
    studioAccessDenied: "Access Denied",
    studioSignInRequired: "Please sign in to create videos",
    studioSignIn: "Sign In",
    studioStep: "Step",
    studioOf: "of",
    studioChooseAvatar: "Choose Avatar",
    studioSelectPresenter: "Select your virtual presenter",
    studioLanguageVoice: "Language & Voice",
    studioPickLanguage: "Pick language and voice",
    studioBackgrounds: "Backgrounds",
    studioChooseScenes: "Choose multiple scenes",
    studioScript: "Script",
    studioWriteMessage: "Write your message",
    studioGenerate: "Generate",
    studioCreateVideo: "Create your video",
    studioPreview: "Preview",
    studioReviewDownload: "Review and download",
    
    // Onboarding Page
    onboardingWelcome: "Welcome to MarketUp",
    onboardingGetStarted: "Let's get you started",
    onboardingSetupTime: "We'll help you set up your account in just a few simple steps. This will only take 2 minutes.",
    onboardingPersonalize: "Personalize",
    onboardingPersonalizeDesc: "Choose your country and language preferences",
    onboardingConfigure: "Configure",
    onboardingConfigureDesc: "Set up your video generation preferences",
    onboardingCreate: "Create",
    onboardingCreateDesc: "Start creating amazing AI videos",
    onboardingStep: "Step",
    onboardingOf: "of",
    onboardingWhereLocated: "Where are you located?",
    onboardingLocationDesc: "This helps us provide relevant content and features for your region.",
    onboardingWhatLanguage: "What's your language?",
    onboardingLanguageDesc: "Choose your preferred language for the interface and content.",
    onboardingBack: "Back",
    onboardingContinue: "Continue",
    onboardingSkip: "Skip for now",
    onboardingCompleteSetup: "Complete Setup",
    onboardingSettingUp: "Setting up...",
    onboardingError: "Could not save preferences. Please try again.",
    
    // Referrals Page
    referralsCreateCode: "Create your referral code",
    referralsGenerateLink: "Generate your unique link",
    referralsYourUserId: "Your user id",
    referralsUserIdPlaceholder: "e.g., usr_123",
    referralsGenerating: "Generating…",
    referralsGenerate: "Generate",
    referralsCodeReady: "Your referral code is ready!",
    referralsYourCode: "Your code",
    referralsCopyLink: "Copy link",
    referralsShareLink: "Share this link:",
    referralsRedeemCode: "Redeem a code",
    referralsEnterCode: "Enter referral code",
    referralsCode: "Code",
    referralsCodePlaceholder: "Enter referral code",
    referralsRedeeming: "Redeeming…",
    referralsRedeem: "Redeem",
    referralsSuccess: "Success — welcome!",
    referralsWelcome: "Success — welcome!",
    referralsInvalidCode: "Invalid code",
    referralsNetworkError: "Network error",
    referralsProvideUserId: "Provide your user id.",
    referralsEnterCodeToRedeem: "Enter a code to redeem.",
    referralsHowReferralsWork: "How Referrals Work",
    referralsStartEarning: "start earning",
    referralsGenerateStep: "Generate",
    referralsGenerateDesc: "Create your personal code in one click.",
    referralsShareStep: "Share",
    referralsShareDesc: "Send your link to friends or clients.",
    referralsEarnStep: "Earn",
    referralsEarnDesc: "Get rewards when they subscribe.",
    referralsStep: "Step",
    
    // Contact Page
    contactHearFromYou: "hear from you",
    contactQuestionsPartnerships: "Questions, partnerships, or press — send us a message and we'll reply shortly.",
    contactResponseTime: "We usually respond within 24 hours.",
    contact24hResponse: "24h response time",
    contactExpertSupport: "Expert support",
    contactNoSpam: "No spam, ever",
    contactGetInTouch: "Get in touch",
    contactSendMessage: "Send us a message and we'll get back to you within 24 hours",
    contactThanksMessage: "Thanks! Your message has been sent.",
    contactResponseTimeDesc: "We usually respond within 24 hours.",
    contactSendAnother: "Send another",
    contactName: "Name",
    contactNamePlaceholder: "Your name",
    contactEmail: "Email",
    contactEmailPlaceholder: "you@company.com",
    contactMessage: "Message",
    contactMessagePlaceholder: "How can we help?",
    contactNoBotsSpam: "No bots, no spam. We'll only use your email to reply.",
    contactFillAllFields: "Please fill all fields.",
    contactValidEmail: "Enter a valid email address.",
    contactMessageLength: "Message should be at least 10 characters.",
    contactSending: "Sending...",
    contactSendMessage: "Send message",
    contactClear: "Clear",
    contactSomethingWrong: "Something went wrong. Please try again.",
    contactOtherWays: "Other ways to reach us",
    contactBusinessHours: "Business Hours",
    contactBusinessHoursDesc: "Mon-Fri, 9AM-6PM EST",
    contactResponseTimeLabel: "Response Time",
    contactResponseTimeValue: "Within 24 hours",
    contactEmailSupport: "Email Support",
    contactGetHelpEmail: "Get help via email",
    contactOnlineNow: "Online now",
    contactEmailDescription: "Send us an email and we'll get back to you within 24 hours. Perfect for detailed questions, feedback, or support requests.",
    contactEmailButton: "support@marketup.app",
    contactEmailSupportMobile: "Email Support",
    contact24hResponseLabel: "24h response",
    contactExpertSupportLabel: "Expert support",
    contactWhatsAppSupport: "WhatsApp Support",
    contactComingSoon: "Coming soon",
    contactInDevelopment: "In development",
    contactWhatsAppDescription: "WhatsApp support will be available soon for instant messaging and quick questions.",
    contactWhatsAppButton: "WhatsApp (Coming Soon)",
    contactWhatsAppMobile: "WhatsApp",
    contactInstantChat: "Instant chat",
    contactFrequentlyAsked: "Frequently asked",
    contactQuestions: "questions",
    contactQuickAnswers: "Quick answers to common questions about our",
    contactAIVideoPlatform: "AI video platform",
    contactHowLong: "How long does it take?",
    contactHowLongDesc: "Our AI generates professional marketing videos in under 5 minutes. Write your script, choose avatar & backgrounds, add visuals, and export HD video ready to share.",
    contactUnder5Minutes: "Under 5 minutes",
    contactHDQuality: "HD quality",
    contactVideoQuality: "Video quality?",
    contactVideoQualityDesc: "We generate HD quality videos (1080p) with professional-grade AI avatars. All videos are optimized for social media platforms and downloadable in multiple formats.",
    contact1080pHD: "1080p HD",
    contactMultipleFormats: "Multiple formats",
    contactCustomVoice: "Custom voice?",
    contactCustomVoiceDesc: "Currently using AI-generated voices that sound natural and professional. Voice cloning features coming soon for personalized videos with your own voice.",
    contactComingSoonLabel: "Coming soon",
    contactAIVoicesNow: "AI voices now",
    contactCommercialUse: "Commercial use?",
    contactCommercialUseDesc: "Yes! All plans include commercial usage rights. Use generated videos for marketing, advertising, social media, and any business purposes without additional licensing fees.",
    contactCommercialRights: "Commercial rights",
    contactNoExtraFees: "No extra fees",
    
    // Pricing Page
    pricingTransparentPricing: "Transparent Pricing",
    pricingSimpleTransparent: "Simple, transparent pricing",
    pricingChoosePerfectPlan: "Choose the perfect plan for your AI video creation needs.",
    pricingNoHiddenFees: "No hidden fees, cancel anytime.",
    pricingMonthly: "Monthly",
    pricingYearly: "Yearly",
    pricingSave20: "Save 20%",
    pricingFree: "Free",
    pricingPro: "Pro",
    pricingEnterprise: "Enterprise",
    pricingPerfectForGettingStarted: "Perfect for getting started",
    pricingBestForProfessionals: "Best for professionals and creators",
    pricingForTeamsOrganizations: "For teams and large organizations",
    pricingMostPopular: "Most Popular",
    pricingEnterpriseBadge: "Enterprise",
    pricingGetStartedFree: "Get Started Free",
    pricingStartProTrial: "Start Pro Trial",
    pricingContactSales: "Contact Sales",
    pricing3VideosPerMonth: "3 videos per month",
    pricingStandardQuality720p: "Standard quality (720p)",
    pricingBasicAvatars: "Basic avatars",
    pricing5Languages: "5 languages",
    pricingCommunitySupport: "Community support",
    pricingWatermarkOnVideos: "Watermark on videos",
    pricing50VideosPerMonth: "50 videos per month",
    pricingHDQuality1080p: "HD quality (1080p)",
    pricingAllAvatarsVoices: "All avatars & voices",
    pricing20PlusLanguages: "20+ languages",
    pricingPrioritySupport: "Priority support",
    pricingNoWatermark: "No watermark",
    pricingCustomBackgrounds: "Custom backgrounds",
    pricingAdvancedEditingTools: "Advanced editing tools",
    pricingAPIAccess: "API access",
    pricingUnlimitedVideos: "Unlimited videos",
    pricing4KQuality2160p: "4K quality (2160p)",
    pricingCustomAvatars: "Custom avatars",
    pricingAllLanguagesVoices: "All languages & voices",
    pricingDedicatedSupport: "Dedicated support",
    pricingCustomBranding: "Custom branding",
    pricingTeamCollaboration: "Team collaboration",
    pricingAdvancedAnalytics: "Advanced analytics",
    pricingWhiteLabelSolution: "White-label solution",
    pricingCustomIntegrations: "Custom integrations",
    pricingSLAGuarantee: "SLA guarantee",
    pricingFeatureComparison: "Feature Comparison",
    pricingCompareAllFeatures: "Compare all features",
    pricingEverythingYouNeed: "Everything you need to choose the right plan",
    pricingFeatures: "Features",
    pricingVideoCreation: "Video Creation",
    pricingAvatarsVoices: "Avatars & Voices",
    pricingSupport: "Support",
    pricingVideosPerMonth: "Videos per month",
    pricingVideoQuality: "Video quality",
    pricingVideoDuration: "Video duration",
    pricingExportFormats: "Export formats",
    pricingAvailableAvatars: "Available avatars",
    pricingVoiceOptions: "Voice options",
    pricingVoiceQuality: "Voice quality",
    pricingCustomVoices: "Custom voices",
    pricingBackgroundOptions: "Background options",
    pricingEmailSupport: "Email support",
    pricingFrequentlyAsked: "Frequently asked",
    pricingQuestions: "questions",
    pricingEverythingYouNeedToKnow: "Everything you need to know about our pricing",
    pricingCanChangePlanAnytime: "Can I change my plan anytime?",
    pricingCanChangePlanAnytimeAnswer: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate any billing differences.",
    pricingWhatHappensToVideos: "What happens to my videos if I downgrade?",
    pricingWhatHappensToVideosAnswer: "Your existing videos remain accessible. You'll just have reduced limits for new video creation based on your new plan.",
    pricingDoYouOfferRefunds: "Do you offer refunds?",
    pricingDoYouOfferRefundsAnswer: "We offer a 30-day money-back guarantee for all paid plans. Contact our support team if you're not satisfied.",
    pricingCanCancelSubscription: "Can I cancel my subscription?",
    pricingCanCancelSubscriptionAnswer: "Yes, you can cancel anytime from your account settings. Your subscription will remain active until the end of your billing period.",
    pricingCustomEnterpriseSolutions: "Do you offer custom enterprise solutions?",
    pricingCustomEnterpriseSolutionsAnswer: "Absolutely! Contact our sales team to discuss custom pricing, features, and integrations for your organization.",
    pricingGetStarted: "Get Started",
    pricingReadyToCreate: "Ready to create amazing AI videos?",
    pricingJoinThousands: "Join thousands of creators and businesses who are already using our platform to create professional AI avatar videos.",
    pricingStartFreeTrial: "Start Free Trial",
    pricingContactSales: "Contact Sales",
    pricingSavePerYear: "Save $/year",
    pricingForever: "forever",
    pricingMonth: "month",
    pricingYear: "year",
    
    // Studio Wizard Components
    studioChooseAvatar: "Choose Avatar",
    studioSelectPresenter: "Select Presenter",
    studioLanguageVoice: "Language & Voice",
    studioPickLanguage: "Pick Language",
    studioBackgrounds: "Backgrounds",
    studioChooseScenes: "Choose Scenes",
    studioScript: "Script",
    studioWriteMessage: "Write Message",
    studioGenerate: "Generate",
    studioCreateVideo: "Create Video",
    studioPreview: "Preview",
    studioReviewDownload: "Review & Download",
    studioStep: "Step",
    studioOf: "of",
    studioAccessDenied: "Access Denied",
    studioSignInRequired: "Sign in required to access the studio",
    studioSignIn: "Sign In",
    
    // Avatar Step
    studioChooseYourAvatar: "Choose your avatar",
    studioSelectVirtualPresenter: "Select a virtual presenter who will deliver your message.",
    studioEachAvatarUnique: "Each avatar has a unique personality and speaking style.",
    studioPreview: "Preview",
    studioWillPresentVideo: "will present your video",
    studioContinue: "Continue",
    
    // Language Step
    studioLanguageVoice: "Language & Voice",
    studioChooseLanguageVoice: "Choose the language and voice for your video.",
    studioPreviewEachVoice: "You can preview each voice before selecting.",
    studioSelectLanguage: "Select Language",
    studioChooseVoice: "Choose Voice",
    studioAllTones: "All Tones",
    studioProfessional: "Professional",
    studioEnergetic: "Energetic",
    studioCalm: "Calm",
    studioExpressive: "Expressive",
    studioPlaying: "Playing...",
    studioPreview: "Preview",
    studioSelectedVoice: "Selected Voice",
    studioBack: "Back",
    studioContinue: "Continue",
    
    // Background Step
    studioChooseBackgrounds: "Choose Backgrounds",
    studioSelectMultipleBackgrounds: "Select multiple backgrounds for your video.",
    studioChoose2To4Scenes: "You can choose 2-4 different scenes to create dynamic transitions.",
    studioAll: "All",
    studioProfessional: "Professional",
    studioCasual: "Casual",
    studioCreative: "Creative",
    studioBackgroundsSelected: "backgrounds selected",
    studioPreview: "Preview",
    studioPreviewMode: "Preview Mode",
    studioExitPreview: "Exit Preview",
    studioSelectedBackgrounds: "Selected Backgrounds",
    studioMoreBackgrounds: "more backgrounds",
    studioBack: "Back",
    studioContinue: "Continue",
    
    // Text Step
    studioWriteYourScript: "Write your script",
    studioWriteTextAvatarSpeak: "Write the text that your avatar will speak.",
    studioStartWithTemplate: "You can start with a template or write your own content.",
    studioQuickTemplates: "Quick Templates",
    studioWelcomeMessage: "Welcome Message",
    studioProductIntroduction: "Product Introduction",
    studioTrainingIntroduction: "Training Introduction",
    studioCompanyAnnouncement: "Company Announcement",
    studioTutorialIntroduction: "Tutorial Introduction",
    studioSpecialOffer: "Special Offer",
    studioBusiness: "Business",
    studioMarketing: "Marketing",
    studioEducation: "Education",
    studioYourScript: "Your Script",
    studioWords: "words",
    studioCharacters: "characters",
    studioDuration: "duration",
    studioShort: "Short",
    studioMedium: "Medium",
    studioLong: "Long",
    studioWriteScriptHere: "Write your script here... Your avatar will speak this text naturally.",
    studioWritingTips: "Writing Tips",
    studioNaturalSpeech: "Natural Speech",
    studioWriteAsYouSpeak: "Write as you would speak naturally, with pauses and emphasis.",
    studioOptimalLength: "Optimal Length",
    studioKeepVideos30To120: "Keep videos between 30-120 seconds for best engagement.",
    studioClearStructure: "Clear Structure",
    studioStartWithHook: "Start with a hook, deliver your message, and end with a call to action.",
    studioPronunciation: "Pronunciation",
    studioUsePhoneticSpelling: "Use phonetic spelling for difficult words: \"AI\" as \"A-I\".",
    studioPreview: "Preview",
    studioBack: "Back",
    studioContinue: "Continue",
    
    // Generation Step
    studioGenerateYourVideo: "Generate Your Video",
    studioCreatePersonalizedVideo: "We'll create your personalized video using AI.",
    studioProcessTakes2To3Minutes: "This process typically takes 2-3 minutes.",
    studioVideoSummary: "Video Summary",
    studioAvatar: "Avatar",
    studioBackground: "Background",
    studioDuration: "Duration",
    studioWords: "words",
    studioGeneratingYourVideo: "Generating Your Video",
    studioDontCloseWindow: "Please don't close this window while we create your video.",
    studioProgress: "Progress",
    studioPreparingAssets: "Preparing assets",
    studioGeneratingAvatarAnimation: "Generating avatar animation",
    studioSynthesizingVoice: "Synthesizing voice",
    studioProcessingBackground: "Processing background",
    studioCompositingVideo: "Compositing video",
    studioFinalizingOutput: "Finalizing output",
    studioComplete: "Complete",
    studioProcessing: "Processing...",
    studioEstimatedTimeRemaining: "Estimated time remaining:",
    studioCancelGeneration: "Cancel Generation",
    studioReadyToGenerate: "Ready to Generate",
    studioVideoCreatedWithSettings: "Your video will be created with the settings above.",
    studioStartGeneration: "Start Generation",
    studioBack: "Back",
    studioGenerationTakes2To3Minutes: "Generation typically takes 2-3 minutes",
    
    // Preview Step
    studioYourVideoReady: "Your Video is Ready!",
    studioReviewGeneratedVideo: "Review your generated video and download it when you're satisfied with the result.",
    studioDownloadWhenSatisfied: "Download it when you're satisfied with the result.",
    studioPlaying: "Playing...",
    studioClickToPreview: "Click to preview",
    studioDuration: "Duration",
    studioQuality: "Quality",
    studioFormat: "Format",
    studioFileSize: "File Size",
    studioVideoSettings: "Video Settings",
    studioVoice: "Voice",
    studioBackground: "Background",
    studioResolution: "Resolution",
    studioScriptLength: "Script Length",
    studioScript: "Script",
    studioActions: "Actions",
    studioDownloading: "Downloading...",
    studioDownloadVideo: "Download Video",
    studioRegenerate: "Regenerate",
    studioSaveContinue: "Save & Continue",
    studioDownloadProgress: "Download Progress",
    studioBack: "Back",
    studioVideoGeneratedSuccessfully: "Video generated successfully",
    
    // About Page
    aboutTitle: "About MarketUp",
    aboutWelcome: "Welcome to MarketUp, a European platform designed to help everyone — from small shop owners and cafés to large companies — promote their business",
    aboutEasilyAffordably: "easily and affordably.",
    aboutEuropeanPlatform: "European platform",
    aboutForEveryone: "For everyone",
    aboutEasyAffordable: "Easy & affordable",
    aboutOurMissionVision: "Our Mission & Vision",
    aboutDrivingInnovation: "Driving innovation in marketing technology for",
    aboutEveryone: "everyone",
    aboutOurMission: "Our Mission",
    aboutMissionText: "Our mission is to empower individuals and businesses to promote their products or services without the need for expensive advertising agencies — just simple, smart, and effective marketing.",
    aboutOurVision: "Our Vision",
    aboutVisionText: "Our vision for the future is to expand MarketUp in new and innovative ways that make marketing even easier and more powerful for all users.",
    aboutWhatMakesDifferent: "What Makes Us Different",
    aboutDifferentText: "What makes us different is our focus on",
    aboutSimplicityQualityAccessibility: "simplicity, quality, and accessibility.",
    aboutWhatMarketUpOffers: "What MarketUp Offers",
    aboutComprehensiveSolutions: "Comprehensive solutions for all your",
    aboutMarketingNeeds: "marketing needs",
    aboutSmartAIVideo: "Smart AI-powered video creation",
    aboutForMarketing: "for marketing",
    aboutAffordablePricing: "Affordable pricing plans",
    aboutSuitableForAll: "suitable for all users",
    aboutMultilingualSupport: "Multilingual support team",
    aboutLanguages: "English, Arabic, Swedish, and Turkish",
    aboutEasyToUse: "Easy-to-use tools",
    aboutMakeVideoMarketing: "that make video marketing faster, more creative, and within everyone's reach",
    aboutActive: "Active",
    aboutOurCommitment: "Our Commitment",
    aboutCommitmentText: "We aim to provide continuous support, smarter tools, and creative solutions to deliver the best possible experience for every customer.",
    aboutQuote: "MarketUp – where your ideas become marketing power",
    aboutOurSlogans: "Our Slogans",
    aboutSlogan: "Slogan",
    aboutSloganText: "MarketUp – your business deserves to be seen",
    aboutTagline: "Tagline",
    aboutTaglineText: "Your story, our technology – one vision for success",
    aboutReadyToTransform: "Ready to transform your",
    aboutMarketing: "marketing?",
    aboutJoinThousands: "Join thousands of businesses who are already using MarketUp to create professional marketing videos.",
    aboutGetStarted: "Get Started",
    aboutSeePricing: "See Pricing",
    
    // Dashboard Page
    dashboardWelcomeBack: "Welcome back,",
    dashboardCreator: "Creator!",
    dashboardTotalVideos: "Total Videos",
    dashboardThisMonth: "this month",
    dashboardCurrentPlan: "Current Plan",
    dashboardFreePlan: "Free Plan",
    dashboardUpgradeToPro: "Upgrade to Pro",
    dashboardStorageUsed: "Storage Used",
    dashboardOfUsed: "of",
    dashboardCompleted: "Completed",
    dashboardReadyToView: "Ready to view",
    dashboardProcessing: "Processing",
    dashboardInProgress: "In progress",
    dashboardTotalViews: "Total Views",
    dashboardAllTime: "All time",
    dashboardDownloads: "Downloads",
    dashboardQuickActions: "Quick Actions",
    dashboardCreateVideo: "Create Video",
    dashboardStartNewProject: "Start a new video project",
    dashboardMyVideos: "My Videos",
    dashboardViewAllVideos: "View all your videos",
    dashboardUpgradePlan: "Upgrade Plan",
    dashboardManageSubscription: "Manage your subscription",
    dashboardSettings: "Settings",
    dashboardAccountPreferences: "Account preferences",
    dashboardRecentVideos: "Recent Videos",
    dashboardViewAll: "View all →",
    dashboardViews: "views",
    dashboardNoVideosYet: "No videos yet",
    dashboardCreateFirstVideo: "Create your first video to get started",
    
    // Profile Page
    profileAnonymousUser: "Anonymous User",
    profileNotSet: "Not set",
    profileCancel: "Cancel",
    profileEditProfile: "Edit Profile",
    profilePersonalInformation: "Personal Information",
    profileFullName: "Full Name",
    profileEnterFullName: "Enter your full name",
    profileEmailAddress: "Email Address",
    profileEnterEmail: "Enter your email",
    profileEmailCannotBeChanged: "Email cannot be changed",
    profileBio: "Bio",
    profileTellAboutYourself: "Tell us about yourself...",
    profileCountry: "Country",
    profileSelectCountry: "Select your country",
    profileLanguage: "Language",
    profileSelectLanguage: "Select your language",
    profileCompany: "Company",
    profileCompanyName: "Your company name",
    profileWebsite: "Website",
    profileWebsiteUrl: "https://yourwebsite.com",
    profileSaving: "Saving...",
    profileSaveChanges: "Save Changes",
    profileProfileStats: "Profile Stats",
    profileProfileCompletion: "Profile Completion",
    profileVideos: "Videos",
    profileProjects: "Projects",
    profileAccountSettings: "Account Settings",
    profileChangePassword: "Change Password",
    profileUpdatePassword: "Update your password",
    profileTwoFactorAuth: "Two-Factor Auth",
    profileAddExtraSecurity: "Add extra security",
    profileDeleteAccount: "Delete Account",
    profilePermanentlyDeleteAccount: "Permanently delete account",
    
    // Videos Page
    videosMyVideos: "My Videos",
    videosManageViewAll: "Manage and view all your created videos",
    videosCreateNewVideo: "Create New Video",
    videosSearchVideos: "Search videos...",
    videosAll: "All",
    videosCompleted: "Completed",
    videosProcessing: "Processing",
    videosQueued: "Queued",
    videosLoadingVideos: "Loading videos...",
    videosStatus: "Status",
    videosDuration: "Duration",
    videosViews: "Views",
    videosDownloads: "Downloads",
    videosView: "View",
    videosEdit: "Edit",
    videosDownload: "Download",
    videosShare: "Share",
    videosDuplicate: "Duplicate",
    videosDelete: "Delete",
    videosProcessingStatus: "Processing...",
    videosNoVideosFound: "No videos found",
    videosTryAdjustingSearch: "Try adjusting your search terms",
    videosCreateFirstVideo: "Create your first video to get started",
    videosCreateVideo: "Create Video",
    videosPage: "Page",
    videosOf: "of",
    videosPrevious: "Previous",
    videosPrev: "Prev",
    videosNext: "Next",
    videosDownloadFunctionalityComingSoon: "Download functionality coming soon!",
    videosShareFunctionalityComingSoon: "Share functionality coming soon!",
    videosDeleteFunctionalityComingSoon: "Delete functionality coming soon!",
    videosDuplicateFunctionalityComingSoon: "Duplicate functionality coming soon!",
    videosAreYouSureDelete: "Are you sure you want to delete this video?",
    
    // Subscription Page
    subscriptionManagement: "Subscription Management",
    subscriptionManageBillingUpgrade: "Manage your subscription, billing, and upgrade your plan to unlock more features",
    subscriptionCurrentPlan: "Current Plan",
    subscriptionManageSubscriptionBilling: "Manage your subscription and billing",
    subscriptionCancelling: "Cancelling",
    subscriptionEnds: "Ends",
    subscriptionNextBilling: "Next Billing",
    subscriptionUsageThisMonth: "Usage This Month",
    subscriptionVideosCreated: "Videos created",
    subscriptionUsed: "used",
    subscriptionChangePlan: "Change Plan",
    subscriptionUpdatePayment: "Update Payment",
    subscriptionCancelSubscription: "Cancel Subscription",
    subscriptionReactivate: "Reactivate",
    subscriptionUpgradePlan: "Upgrade Plan",
    subscriptionAvailablePlans: "Available Plans",
    subscriptionChoosePlanBestFits: "Choose the plan that best fits your needs and unlock more features",
    subscriptionMostPopular: "Most Popular",
    subscriptionChoosePlan: "Choose Plan",
    subscriptionBillingHistory: "Billing History",
    subscriptionTrackPaymentHistory: "Track your payment history and download invoices",
    subscriptionDownload: "Download",
    subscriptionNoBillingHistory: "No billing history",
    subscriptionBillingHistoryWillAppear: "Your billing history will appear here",
    subscriptionErrorLoadingData: "Error loading subscription data",
    subscriptionPleaseTryRefreshing: "Please try refreshing the page",
    subscriptionRefreshPage: "Refresh Page",
    subscriptionChangePlanFunctionalityComingSoon: "Change Plan functionality coming soon!",
    subscriptionUpdatePaymentFunctionalityComingSoon: "Update Payment functionality coming soon!",
    subscriptionCancelSubscriptionFunctionalityComingSoon: "Cancel Subscription functionality coming soon!",
    subscriptionUpgradePlanFunctionalityComingSoon: "Upgrade Plan functionality coming soon!",
    subscriptionDownloadInvoiceFunctionalityComingSoon: "Download invoice functionality coming soon!",
    subscriptionUpgradeToPlanFunctionalityComingSoon: "Upgrade to {plan} plan functionality coming soon!",
    
    // Billing Page
    billingInvoices: "Billing & Invoices",
    billingManageBillingInformation: "Manage your billing information, payment methods, and track your usage",
    billingOverview: "Overview",
    billingPaymentMethods: "Payment Methods",
    billingUsage: "Usage",
    billingErrorLoadingData: "Error loading billing data",
    billingPleaseTryRefreshing: "Please try refreshing the page",
    billingRefreshPage: "Refresh Page",
    billingCurrentBillingPeriod: "Current Billing Period",
    billingPeriod: "Period",
    billingCurrentBillingCycle: "Current billing cycle",
    billingAmount: "Amount",
    billingStatus: "Status",
    billingFreePlan: "Free plan",
    billingAutoRenewalEnabled: "Auto-renewal enabled",
    billingUsageThisMonth: "Usage This Month",
    billingVideosCreated: "Videos Created",
    billingOf: "of",
    billingStorageUsed: "Storage Used",
    billingBandwidth: "Bandwidth",
    billingThisMonth: "this month",
    billingInvoiceHistory: "Invoice History",
    billingNoInvoicesYet: "No invoices yet",
    billingInvoiceHistoryWillAppear: "Your invoice history will appear here",
    billingDownload: "Download",
    billingAddPaymentMethod: "Add Payment Method",
    billingDefault: "Default",
    billingEdit: "Edit",
    billingNoPaymentMethod: "No payment method",
    billingAddPaymentMethodToManage: "Add a payment method to manage your subscription",
    billingDetailedUsage: "Detailed Usage",
    billingBandwidthThisMonth: "Bandwidth This Month",
    billingUnlimited: "Unlimited",
    
    // Settings Page
    settingsTitle: "Settings",
    settingsManageAccountPreferences: "Manage your account preferences, notifications, and security settings",
    settingsMemberSince: "Member since",
    settingsSaving: "Saving...",
    settingsSaveChanges: "Save Changes",
    settingsAccountInformation: "Account Information",
    settingsEmail: "Email",
    settingsName: "Name",
    settingsCountry: "Country",
    settingsSelectCountry: "Select Country",
    settingsNotifications: "Notifications",
    settingsEmailNotifications: "Email Notifications",
    settingsReceiveNotificationsViaEmail: "Receive notifications via email",
    settingsPushNotifications: "Push Notifications",
    settingsReceivePushNotificationsInBrowser: "Receive push notifications in your browser",
    settingsMarketingEmails: "Marketing Emails",
    settingsReceiveUpdatesAboutNewFeatures: "Receive updates about new features and tips",
    settingsProductUpdates: "Product Updates",
    settingsGetNotifiedAboutNewFeatures: "Get notified about new features and improvements",
    settingsPrivacySecurity: "Privacy & Security",
    settingsProfileVisibility: "Profile Visibility",
    settingsControlWhoCanSeeProfile: "Control who can see your profile information",
    settingsPublic: "Public",
    settingsPrivate: "Private",
    settingsFriendsOnly: "Friends Only",
    settingsAnalytics: "Analytics",
    settingsHelpUsImproveBySharing: "Help us improve by sharing anonymous usage data",
    settingsDataSharing: "Data Sharing",
    settingsAllowSharingDataWithPartners: "Allow sharing data with third-party partners",
    settingsPreferences: "Preferences",
    settingsTheme: "Theme",
    settingsDark: "Dark",
    settingsLight: "Light",
    settingsAuto: "Auto",
    settingsLanguage: "Language",
    settingsEnglish: "English",
    settingsUkrainian: "Українська",
    settingsSpanish: "Español",
    settingsFrench: "Français",
    settingsTimezone: "Timezone",
    settingsUTC: "UTC",
    settingsEasternTime: "Eastern Time",
    settingsPacificTime: "Pacific Time",
    settingsLondon: "London",
    settingsKiev: "Kiev",
    settingsDateFormat: "Date Format",
    settingsMMDDYYYY: "MM/DD/YYYY",
    settingsDDMMYYYY: "DD/MM/YYYY",
    settingsYYYYMMDD: "YYYY-MM-DD",
    settingsDangerZone: "Danger Zone",
    settingsExportData: "Export Data",
    settingsDownloadCopyOfData: "Download a copy of your data",
    settingsExport: "Export",
    settingsDeleteAccount: "Delete Account",
    settingsPermanentlyDeleteAccount: "Permanently delete your account and all data",
    settingsSettingsSavedSuccessfully: "Settings saved successfully!",
    settingsErrorSavingSettings: "Error saving settings. Please try again.",
    settingsDataExportFeatureComingSoon: "Data export feature coming soon!",
    settingsAccountDeletionFeatureComingSoon: "Account deletion feature coming soon!",
    settingsAreYouSureDeleteAccount: "Are you sure you want to delete your account? This action cannot be undone.",
    
    // Remember Me Settings
    rememberMeSettings: "Remember Me Settings",
    rememberMeDescription: "Remember Me allows you to stay signed in for up to 30 days on trusted devices. If you're using a shared or public computer, we recommend not using this feature.",
    rememberMeClearSessions: "Clear Remember Me Sessions",
    rememberMeClearSessionsDescription: "This will sign you out of all devices where you've chosen to be remembered.",
    rememberMeClearing: "Clearing...",
    rememberMeClearAllSessions: "Clear All Sessions",
    rememberMeSessionsClearedSuccessfully: "Remember me sessions cleared successfully",
    rememberMeFailedToClearSessions: "Failed to clear remember me sessions",
    rememberMeErrorOccurred: "An error occurred while clearing sessions",
    
    // Dashboard Sidebar
    dashboardSidebarTitle: "Dashboard",
    dashboardSidebarWelcomeBack: "Welcome back",
    dashboardSidebarOverview: "Overview",
    dashboardSidebarProfile: "Profile",
    dashboardSidebarVideos: "Videos",
    dashboardSidebarSubscription: "Subscription",
    dashboardSidebarBilling: "Billing",
    dashboardSidebarSettings: "Settings",
    dashboardSidebarAccount: "Account",
    dashboardSidebarSignOut: "Sign out",
    dashboardSidebarManageAccount: "Manage your account and preferences",
    
    // Admin Panel
    adminOverview: "Overview of your platform metrics and analytics",
    adminOverviewDescription: "Overview of your platform metrics and analytics",
    adminExportReport: "Export Report",
    adminRefreshing: "Refreshing...",
    adminRefreshData: "Refresh Data",
    adminTotalUsers: "Total Users",
    adminTotalRevenue: "Total Revenue",
    adminVideosCreated: "Videos Created",
    adminActiveUsers: "Active Users",
    adminRevenueTrend: "Revenue Trend",
    adminRevenue: "Revenue",
    adminUserActivity: "User Activity",
    adminActiveUsers: "Active Users",
    adminChartVisualizationComingSoon: "Chart visualization coming soon",
    adminRecentActivity: "Recent Activity",
    adminNoRecentActivity: "No recent activity",
    adminActivityWillAppearHere: "Activity will appear here as users interact with the platform",
    adminErrorLoadingData: "Error loading admin data",
    adminTryAgain: "Try Again",
    adminNetworkErrorOccurred: "Network error occurred",
    
    // Admin Users Management
    adminUsersManagement: "Users Management",
    adminUsersManagementDescription: "Manage platform users, their accounts, and permissions",
    adminAddUser: "Add User",
    adminSearchFilters: "Search & Filters",
    adminSearchUsers: "Search users...",
    adminAllStatus: "All Status",
    adminActive: "Active",
    adminInactive: "Inactive",
    adminSuspended: "Suspended",
    adminAllSubscriptions: "All Subscriptions",
    adminFree: "Free",
    adminBasic: "Basic",
    adminPremium: "Premium",
    adminEnterprise: "Enterprise",
    adminSortByJoinDate: "Sort by Join Date",
    adminSortByName: "Sort by Name",
    adminSortByEmail: "Sort by Email",
    adminSortByLastActive: "Sort by Last Active",
    adminSortByVideos: "Sort by Videos",
    adminSortByTotalSpent: "Sort by Total Spent",
    adminUsersSelected: "users selected",
    adminUserSelected: "user selected",
    adminActivate: "Activate",
    adminSuspend: "Suspend",
    adminDelete: "Delete",
    adminClear: "Clear",
    adminUser: "User",
    adminStatus: "Status",
    adminSubscription: "Subscription",
    adminVideos: "Videos",
    adminTotalSpent: "Total Spent",
    adminLastActive: "Last Active",
    adminActions: "Actions",
    adminShowingUsers: "Showing",
    adminOfUsers: "of",
    adminPrevious: "Previous",
    adminNext: "Next",
    adminEditUser: "Edit User",
    adminName: "Name",
    adminEmail: "Email",
    adminRole: "Role",
    adminUserRole: "User",
    adminAdminRole: "Admin",
    adminModeratorRole: "Moderator",
    adminSaveChanges: "Save Changes",
    adminCancel: "Cancel",
    adminUserUpdatedSuccessfully: "User updated successfully!",
    adminFailedToUpdateUser: "Failed to update user:",
    adminErrorUpdatingUser: "Error updating user",
    adminAreYouSureDeleteUsers: "Are you sure you want to delete",
    adminUsersDeletedSuccessfully: "users deleted successfully!",
    adminFailedToDeleteUsers: "Failed to delete users:",
    adminErrorPerformingAction: "Error performing",
    adminActionComingSoon: "action for",
    
    // Admin Videos Management
    adminVideosModeration: "Video Moderation",
    adminVideosModerationDescription: "Review and moderate video content uploaded by users",
    adminVideosToReview: "videos to review",
    adminVideosSearchFilters: "Search & Filters",
    adminVideosSearch: "Search",
    adminVideosSearchPlaceholder: "Search videos or uploaders...",
    adminVideosStatus: "Status",
    adminVideosAllStatus: "All Status",
    adminVideosPending: "Pending",
    adminVideosApproved: "Approved",
    adminVideosRejected: "Rejected",
    adminVideosSortBy: "Sort By",
    adminVideosUploadDate: "Upload Date",
    adminVideosTitle: "Title",
    adminVideosUploader: "Uploader",
    adminVideosFlags: "Flags",
    adminVideosOrder: "Order",
    adminVideosNewestFirst: "Newest First",
    adminVideosOldestFirst: "Oldest First",
    adminVideosReview: "Review",
    adminVideosReason: "Reason",
    adminVideosViews: "views",
    adminVideosLikes: "likes",
    adminVideosFlagsCount: "flags",
    adminVideosReviewVideo: "Review Video",
    adminVideosVideoInformation: "Video Information",
    adminVideosDuration: "Duration",
    adminVideosCategory: "Category",
    adminVideosUploadDate: "Upload Date",
    adminVideosFlagsCount: "Flags",
    adminVideosUploaderInformation: "Uploader Information",
    adminVideosDescription: "Description",
    adminVideosTags: "Tags",
    adminVideosReject: "Reject",
    adminVideosApprove: "Approve",
    adminVideosEnterRejectionReason: "Enter rejection reason:",
    adminVideosVideoPlayer: "Video Player",
    adminVideosClickToPlay: "Click to play",
    
    // Admin Scheduler Management
    adminSchedulerPublicationScheduler: "Publication Scheduler",
    adminSchedulerScheduleVideoPublications: "Schedule video publications across social networks",
    adminSchedulerScheduleNewPost: "+ Schedule New Post",
    adminSchedulerSearchFilters: "Search & Filters",
    adminSchedulerStatusFilter: "Status Filter",
    adminSchedulerAllStatus: "All Status",
    adminSchedulerScheduled: "Scheduled",
    adminSchedulerPublished: "Published",
    adminSchedulerFailed: "Failed",
    adminSchedulerCancelled: "Cancelled",
    adminSchedulerSocialNetwork: "Social Network",
    adminSchedulerAllNetworks: "All Networks",
    adminSchedulerDuration: "Duration",
    adminSchedulerCategory: "Category",
    adminSchedulerPublishesIn: "Publishes in",
    adminSchedulerPublishNow: "Publish Now",
    adminSchedulerCancel: "Cancel",
    adminSchedulerScheduleNewPost: "Schedule New Post",
    adminSchedulerSelectVideo: "Select Video *",
    adminSchedulerSelectSocialNetworks: "Select Social Networks *",
    adminSchedulerPublicationDate: "Publication Date *",
    adminSchedulerPublicationTime: "Publication Time *",
    adminSchedulerCustomMessage: "Custom Message",
    adminSchedulerCustomMessageOptional: "Custom Message (Optional)",
    adminSchedulerCustomMessagePlaceholder: "Add a custom message to accompany your video...",
    adminSchedulerCancel: "Cancel",
    adminSchedulerSchedulePost: "Schedule Post",
    adminSchedulerScheduling: "Scheduling...",
    adminSchedulerPleaseSelectVideo: "Please select a video",
    adminSchedulerPleaseSelectNetwork: "Please select at least one social network",
    adminSchedulerPleaseSelectDate: "Please select a publication date",
    adminSchedulerPleaseSelectTime: "Please select a publication time",
    adminSchedulerPostScheduledSuccessfully: "Post scheduled successfully!",
    adminSchedulerFailedToSchedulePost: "Failed to schedule post. Please try again.",
    adminSchedulerErrorSchedulingPost: "Error scheduling post. Please try again.",
    adminSchedulerFailedToCancelPost: "Failed to cancel post. Please try again.",
    adminSchedulerErrorCancellingPost: "Error cancelling post. Please try again.",
    adminSchedulerFailedToPublishPost: "Failed to publish post. Please try again.",
    adminSchedulerErrorPublishingPost: "Error publishing post. Please try again.",
    adminSchedulerOverdue: "Overdue",
    
    // Admin Payments Management
    adminPaymentsPaymentManagement: "Payment Management",
    adminPaymentsViewManageTransactions: "View and manage payment transactions",
    adminPaymentsTransactions: "transactions",
    adminPaymentsSearchFilters: "Search & Filters",
    adminPaymentsSearch: "Search",
    adminPaymentsSearchPlaceholder: "Search transactions...",
    adminPaymentsStatus: "Status",
    adminPaymentsAllStatus: "All Status",
    adminPaymentsPending: "Pending",
    adminPaymentsCompleted: "Completed",
    adminPaymentsFailed: "Failed",
    adminPaymentsRefunded: "Refunded",
    adminPaymentsCancelled: "Cancelled",
    adminPaymentsType: "Type",
    adminPaymentsAllTypes: "All Types",
    adminPaymentsSubscription: "Subscription",
    adminPaymentsOneTime: "One Time",
    adminPaymentsRefund: "Refund",
    adminPaymentsUpgrade: "Upgrade",
    adminPaymentsDateRange: "Date Range",
    adminPaymentsAllTime: "All Time",
    adminPaymentsToday: "Today",
    adminPaymentsThisWeek: "This Week",
    adminPaymentsThisMonth: "This Month",
    adminPaymentsThisYear: "This Year",
    adminPaymentsTotalRevenue: "Total Revenue",
    adminPaymentsCompleted: "Completed",
    adminPaymentsPending: "Pending",
    adminPaymentsFailed: "Failed",
    adminPaymentsInvoice: "Invoice",
    adminPaymentsConfirm: "Confirm",
    adminPaymentsCancel: "Cancel",
    adminPaymentsRefund: "Refund",
    adminPaymentsView: "View",
    adminPaymentsTransactionDetails: "Transaction Details",
    adminPaymentsTransactionInformation: "Transaction Information",
    adminPaymentsUserInformation: "User Information",
    adminPaymentsAdditionalInformation: "Additional Information",
    adminPaymentsPlan: "Plan",
    adminPaymentsBilling: "Billing",
    adminPaymentsDiscount: "Discount",
    adminPaymentsTax: "Tax",
    adminPaymentsCancelPayment: "Cancel Payment",
    adminPaymentsRefund: "Refund",
    adminPaymentsConfirmPayment: "Confirm Payment",
    adminPaymentsEnterCancellationReason: "Enter cancellation reason:",
    adminPaymentsEnterRefundReason: "Enter refund reason:",
    adminPaymentsFailedToConfirmPayment: "Failed to confirm payment. Please try again.",
    adminPaymentsErrorConfirmingPayment: "Error confirming payment. Please try again.",
    adminPaymentsRefundFunctionalityWouldBeImplemented: "Refund functionality would be implemented here",
    adminPaymentsErrorProcessingRefund: "Error processing refund. Please try again.",
    adminPaymentsFailedToCancelPayment: "Failed to cancel payment. Please try again.",
    adminPaymentsErrorCancellingPayment: "Error cancelling payment. Please try again.",
    
    // Admin Tickets Management
    adminTicketsSupportTickets: "Support Tickets",
    adminTicketsManageCustomerSupport: "Manage customer support tickets for premium clients",
    adminTicketsTickets: "tickets",
    adminTicketsSearchFilters: "Search & Filters",
    adminTicketsSearch: "Search",
    adminTicketsSearchPlaceholder: "Search tickets...",
    adminTicketsStatus: "Status",
    adminTicketsAllStatus: "All Status",
    adminTicketsOpen: "Open",
    adminTicketsInProgress: "In Progress",
    adminTicketsResolved: "Resolved",
    adminTicketsClosed: "Closed",
    adminTicketsPriority: "Priority",
    adminTicketsAllPriority: "All Priority",
    adminTicketsUrgent: "Urgent",
    adminTicketsHigh: "High",
    adminTicketsMedium: "Medium",
    adminTicketsLow: "Low",
    adminTicketsCategory: "Category",
    adminTicketsAllCategories: "All Categories",
    adminTicketsTechnical: "Technical",
    adminTicketsBilling: "Billing",
    adminTicketsFeatureRequest: "Feature Request",
    adminTicketsBugReport: "Bug Report",
    adminTicketsGeneral: "General",
    adminTicketsSubscription: "Subscription",
    adminTicketsAllSubscriptions: "All Subscriptions",
    adminTicketsPremium: "Premium",
    adminTicketsEnterprise: "Enterprise",
    adminTicketsTotalTickets: "Total Tickets",
    adminTicketsOpen: "Open",
    adminTicketsInProgress: "In Progress",
    adminTicketsResolved: "Resolved",
    adminTicketsUrgent: "Urgent",
    adminTicketsView: "View",
    adminTicketsAssignedTo: "Assigned to",
    adminTicketsMessages: "messages",
    adminTicketsTicketInformation: "Ticket Information",
    adminTicketsUserInformation: "User Information",
    adminTicketsDescription: "Description",
    adminTicketsConversation: "Conversation",
    adminTicketsAssignToMe: "Assign to Me",
    adminTicketsTypeYourResponse: "Type your response...",
    adminTicketsSend: "Send",
    adminTicketsFailedToSendMessage: "Failed to send message. Please try again.",
    adminTicketsErrorSendingMessage: "Error sending message. Please try again.",
    adminTicketsFailedToUpdateStatus: "Failed to update status. Please try again.",
    adminTicketsErrorUpdatingStatus: "Error updating status. Please try again.",
    adminTicketsFailedToAssignTicket: "Failed to assign ticket. Please try again.",
    adminTicketsErrorAssigningTicket: "Error assigning ticket. Please try again.",
    adminTicketsJustNow: "Just now",
    adminTicketsHoursAgo: "h ago",
    adminTicketsDaysAgo: "d ago",

    // Admin Sidebar
    adminSidebarDashboard: "Dashboard",
    adminSidebarUsers: "Users",
    adminSidebarVideoModeration: "Video Moderation",
    adminSidebarPublicationScheduler: "Publication Scheduler",
    adminSidebarPaymentManagement: "Payment Management",
    adminSidebarTicketSystem: "Ticket System",
    adminSidebarAdminPanel: "Admin Panel",
    adminSidebarManagePlatform: "Manage your platform and analytics",
    adminSidebarSignOut: "Sign Out",

    // Admin Header
    adminHeaderDashboard: "Dashboard",
    adminHeaderUsers: "Users",
    adminHeaderVideoModeration: "Video Moderation",
    adminHeaderPublicationScheduler: "Publication Scheduler",
    adminHeaderPaymentManagement: "Payment Management",
    adminHeaderTicketSystem: "Ticket System",
    adminHeaderAdminPanel: "Admin Panel",
    adminHeaderManagePlatform: "Manage your platform and analytics",
    adminHeaderSearch: "Search",
    adminHeaderSearchPlaceholder: "Search...",
    adminHeaderNotifications: "Notifications",
    adminHeaderNewUserRegistered: "New user registered",
    adminHeaderVideoProcessingCompleted: "Video processing completed",
    adminHeaderSystemBackupCompleted: "System backup completed",
    adminHeaderMinutesAgo: "minutes ago",
    adminHeaderHourAgo: "hour ago",
    adminHeaderAdminUser: "Admin User",
  },
  
  sv: {
    // Navigation
    home: "Hem",
    studio: "Studio",
    pricing: "Priser",
    about: "Om oss",
    contact: "Kontakt",
    referrals: "Rekommendationer",
    
    // Hero Section
    heroTitle: "Skapa premium AI-avatarvideos på under 5 minuter.",
    heroSubtitle: "För kaféer, restauranger, butiker och skapare. Elegant, futuristisk, enkel.",
    getStarted: "Kom igång",
    seePricing: "Se priser",
    
    // Trust indicators
    noCreditCard: "Inget kreditkort krävs",
    fiveMinuteSetup: "5-minuters installation",
    hdQuality: "HD-kvalitetsvideos",
    
    // How it works
    howItWorks: "Så fungerar det",
    howItWorksSubtitle: "Skapa professionella marknadsföringsvideos på bara 4 enkla steg",
    step1Title: "Skriv ditt manus",
    step1Description: "Skriv ett kort manus eller klistra in din produktpresentation. Vår AI kommer att optimera det för video.",
    step2Title: "Välj avatar & bakgrunder",
    step2Description: "Välj en avatar och ställ in 2-4 bakgrunder som matchar ditt varumärke och budskap.",
    step3Title: "Lägg till visuella element",
    step3Description: "Lägg till produkt-, enhets- eller matbilder för visuella ögonblick som engagerar din publik.",
    step4Title: "Exportera & dela",
    step4Description: "Exportera en video med subtil logotypöverlagring och din kontaktinformation redo att dela.",
    
    // Preview Section
    seeItInAction: "Se det i aktion",
    previewSubtitle: "Se hur enkelt det är att skapa professionella marknadsföringsvideos",
    lightningFast: "Blixtsnabb",
    lightningFastDesc: "Generera på under 5 minuter",
    hdQualityTitle: "HD-kvalitet",
    hdQualityDesc: "Professionella 4K-videos",
    autoPublishing: "Automatisk publicering",
    autoPublishingDesc: "Direkt till sociala medier",
    
    // Pricing Section
    simplePricing: "Enkla priser",
    pricingSubtitle: "Enkla planer för skapare och företag. Se fullständiga detaljer på prissidan.",
    seePricingButton: "Se priser",
    startNow: "Börja nu",
    
    // Account Menu
    account: "Konto",
    dashboard: "Instrumentpanel",
    profile: "Profil",
    myVideos: "Mina videos",
    subscription: "Prenumeration",
    settings: "Inställningar",
    adminPanel: "Admin-panel",
    signOut: "Logga ut",
    
    // Footer
    footerTitle: "Redo att skapa fantastiska videor?",
    footerSubtitle: "Gå med tusentals skapare som använder MarketUp",
    footerGetStarted: "Kom igång",
    footerFollowUs: "Följ oss:",
    footerInstagram: "Instagram",
    footerFacebook: "Facebook",
    footerTikTok: "TikTok",
    footerCopyright: "©️ 2026 MarketUp. Alla rättigheter förbehållna.",
    footerContact: "Kontakt:",
    footerPrivacy: "Integritet",
    footerTerms: "Villkor",
    footerCookies: "Kakor",
    
    // Studio Page
    studioAccessDenied: "Åtkomst nekad",
    studioSignInRequired: "Logga in för att skapa videor",
    studioSignIn: "Logga in",
    studioStep: "Steg",
    studioOf: "av",
    studioChooseAvatar: "Välj Avatar",
    studioSelectPresenter: "Välj din virtuella presentatör",
    studioLanguageVoice: "Språk & Röst",
    studioPickLanguage: "Välj språk och röst",
    studioBackgrounds: "Bakgrunder",
    studioChooseScenes: "Välj flera scener",
    studioScript: "Manus",
    studioWriteMessage: "Skriv ditt meddelande",
    studioGenerate: "Generera",
    studioCreateVideo: "Skapa din video",
    studioPreview: "Förhandsvisning",
    studioReviewDownload: "Granska och ladda ner",
    
    // Onboarding Page
    onboardingWelcome: "Välkommen till MarketUp",
    onboardingGetStarted: "Låt oss komma igång",
    onboardingSetupTime: "Vi hjälper dig att sätta upp ditt konto på bara några enkla steg. Detta tar bara 2 minuter.",
    onboardingPersonalize: "Personalisera",
    onboardingPersonalizeDesc: "Välj ditt land och språkinställningar",
    onboardingConfigure: "Konfigurera",
    onboardingConfigureDesc: "Ställ in dina videogenereringsinställningar",
    onboardingCreate: "Skapa",
    onboardingCreateDesc: "Börja skapa fantastiska AI-videor",
    onboardingStep: "Steg",
    onboardingOf: "av",
    onboardingWhereLocated: "Var befinner du dig?",
    onboardingLocationDesc: "Detta hjälper oss att tillhandahålla relevant innehåll och funktioner för din region.",
    onboardingWhatLanguage: "Vad är ditt språk?",
    onboardingLanguageDesc: "Välj ditt föredragna språk för gränssnittet och innehållet.",
    onboardingBack: "Tillbaka",
    onboardingContinue: "Fortsätt",
    onboardingSkip: "Hoppa över för nu",
    onboardingCompleteSetup: "Slutför installationen",
    onboardingSettingUp: "Konfigurerar...",
    onboardingError: "Kunde inte spara inställningar. Försök igen.",
    
    // Referrals Page
    referralsCreateCode: "Skapa din hänvisningskod",
    referralsGenerateLink: "Generera din unika länk",
    referralsYourUserId: "Ditt användar-ID",
    referralsUserIdPlaceholder: "t.ex., usr_123",
    referralsGenerating: "Genererar…",
    referralsGenerate: "Generera",
    referralsCodeReady: "Din hänvisningskod är redo!",
    referralsYourCode: "Din kod",
    referralsCopyLink: "Kopiera länk",
    referralsShareLink: "Dela denna länk:",
    referralsRedeemCode: "Lösa in en kod",
    referralsEnterCode: "Ange hänvisningskod",
    referralsCode: "Kod",
    referralsCodePlaceholder: "Ange hänvisningskod",
    referralsRedeeming: "Löser in…",
    referralsRedeem: "Lös in",
    referralsSuccess: "Framgång — välkommen!",
    referralsWelcome: "Framgång — välkommen!",
    referralsInvalidCode: "Ogiltig kod",
    referralsNetworkError: "Nätverksfel",
    referralsProvideUserId: "Ange ditt användar-ID.",
    referralsEnterCodeToRedeem: "Ange en kod att lösa in.",
    referralsHowReferralsWork: "Hur hänvisningar fungerar",
    referralsStartEarning: "börja tjäna",
    referralsGenerateStep: "Generera",
    referralsGenerateDesc: "Skapa din personliga kod med ett klick.",
    referralsShareStep: "Dela",
    referralsShareDesc: "Skicka din länk till vänner eller klienter.",
    referralsEarnStep: "Tjäna",
    referralsEarnDesc: "Få belöningar när de prenumererar.",
    referralsStep: "Steg",
    
    // Contact Page
    contactHearFromYou: "höra från dig",
    contactQuestionsPartnerships: "Frågor, partnerskap eller press — skicka oss ett meddelande så svarar vi snart.",
    contactResponseTime: "Vi svarar vanligtvis inom 24 timmar.",
    contact24hResponse: "24h svarstid",
    contactExpertSupport: "Expertstöd",
    contactNoSpam: "Ingen spam, någonsin",
    contactGetInTouch: "Kom i kontakt",
    contactSendMessage: "Skicka oss ett meddelande så hör vi av oss inom 24 timmar",
    contactThanksMessage: "Tack! Ditt meddelande har skickats.",
    contactResponseTimeDesc: "Vi svarar vanligtvis inom 24 timmar.",
    contactSendAnother: "Skicka ett till",
    contactName: "Namn",
    contactNamePlaceholder: "Ditt namn",
    contactEmail: "E-post",
    contactEmailPlaceholder: "du@foretag.se",
    contactMessage: "Meddelande",
    contactMessagePlaceholder: "Hur kan vi hjälpa?",
    contactNoBotsSpam: "Inga robotar, ingen spam. Vi använder bara din e-post för att svara.",
    contactFillAllFields: "Fyll i alla fält.",
    contactValidEmail: "Ange en giltig e-postadress.",
    contactMessageLength: "Meddelandet ska vara minst 10 tecken.",
    contactSending: "Skickar...",
    contactSendMessage: "Skicka meddelande",
    contactClear: "Rensa",
    contactSomethingWrong: "Något gick fel. Försök igen.",
    contactOtherWays: "Andra sätt att nå oss",
    contactBusinessHours: "Öppettider",
    contactBusinessHoursDesc: "Mån-fre, 09:00-18:00 EST",
    contactResponseTimeLabel: "Svarstid",
    contactResponseTimeValue: "Inom 24 timmar",
    contactEmailSupport: "E-poststöd",
    contactGetHelpEmail: "Få hjälp via e-post",
    contactOnlineNow: "Online nu",
    contactEmailDescription: "Skicka oss ett e-postmeddelande så hör vi av oss inom 24 timmar. Perfekt för detaljerade frågor, feedback eller supportförfrågningar.",
    contactEmailButton: "support@marketup.app",
    contactEmailSupportMobile: "E-poststöd",
    contact24hResponseLabel: "24h svar",
    contactExpertSupportLabel: "Expertstöd",
    contactWhatsAppSupport: "WhatsApp-stöd",
    contactComingSoon: "Kommer snart",
    contactInDevelopment: "Under utveckling",
    contactWhatsAppDescription: "WhatsApp-stöd kommer snart för omedelbar meddelandehantering och snabba frågor.",
    contactWhatsAppButton: "WhatsApp (Kommer snart)",
    contactWhatsAppMobile: "WhatsApp",
    contactInstantChat: "Omedelbar chatt",
    contactFrequentlyAsked: "Vanliga frågor",
    contactQuestions: "frågor",
    contactQuickAnswers: "Snabba svar på vanliga frågor om vår",
    contactAIVideoPlatform: "AI-videoplattform",
    contactHowLong: "Hur lång tid tar det?",
    contactHowLongDesc: "Vår AI genererar professionella marknadsföringsvideor på under 5 minuter. Skriv ditt manus, välj avatar och bakgrunder, lägg till visuella element och exportera HD-video redo att dela.",
    contactUnder5Minutes: "Under 5 minuter",
    contactHDQuality: "HD-kvalitet",
    contactVideoQuality: "Videokvalitet?",
    contactVideoQualityDesc: "Vi genererar HD-kvalitetsvideor (1080p) med professionella AI-avatarer. Alla videor är optimerade för sociala medieplattformar och nedladdningsbara i flera format.",
    contact1080pHD: "1080p HD",
    contactMultipleFormats: "Flera format",
    contactCustomVoice: "Anpassad röst?",
    contactCustomVoiceDesc: "Använder för närvarande AI-genererade röster som låter naturliga och professionella. Röstkloningsfunktioner kommer snart för personaliserade videor med din egen röst.",
    contactComingSoonLabel: "Kommer snart",
    contactAIVoicesNow: "AI-röster nu",
    contactCommercialUse: "Kommersiell användning?",
    contactCommercialUseDesc: "Ja! Alla planer inkluderar kommersiella användningsrättigheter. Använd genererade videor för marknadsföring, reklam, sociala medier och alla affärsändamål utan ytterligare licensavgifter.",
    contactCommercialRights: "Kommersiella rättigheter",
    contactNoExtraFees: "Inga extra avgifter",
    
    // Pricing Page
    pricingTransparentPricing: "Transparent prissättning",
    pricingSimpleTransparent: "Enkel, transparent prissättning",
    pricingChoosePerfectPlan: "Välj den perfekta planen för dina AI-videobehov.",
    pricingNoHiddenFees: "Inga dolda avgifter, avsluta när som helst.",
    pricingMonthly: "Månadsvis",
    pricingYearly: "Årligen",
    pricingSave20: "Spara 20%",
    pricingFree: "Gratis",
    pricingPro: "Pro",
    pricingEnterprise: "Enterprise",
    pricingPerfectForGettingStarted: "Perfekt för att komma igång",
    pricingBestForProfessionals: "Bäst för professionella och skapare",
    pricingForTeamsOrganizations: "För team och stora organisationer",
    pricingMostPopular: "Mest populär",
    pricingEnterpriseBadge: "Enterprise",
    pricingGetStartedFree: "Kom igång gratis",
    pricingStartProTrial: "Starta Pro-prova",
    pricingContactSales: "Kontakta försäljning",
    pricing3VideosPerMonth: "3 videor per månad",
    pricingStandardQuality720p: "Standardkvalitet (720p)",
    pricingBasicAvatars: "Grundläggande avatarer",
    pricing5Languages: "5 språk",
    pricingCommunitySupport: "Community-stöd",
    pricingWatermarkOnVideos: "Vattenstämpel på videor",
    pricing50VideosPerMonth: "50 videor per månad",
    pricingHDQuality1080p: "HD-kvalitet (1080p)",
    pricingAllAvatarsVoices: "Alla avatarer och röster",
    pricing20PlusLanguages: "20+ språk",
    pricingPrioritySupport: "Prioriterat stöd",
    pricingNoWatermark: "Ingen vattenstämpel",
    pricingCustomBackgrounds: "Anpassade bakgrunder",
    pricingAdvancedEditingTools: "Avancerade redigeringsverktyg",
    pricingAPIAccess: "API-åtkomst",
    pricingUnlimitedVideos: "Obegränsade videor",
    pricing4KQuality2160p: "4K-kvalitet (2160p)",
    pricingCustomAvatars: "Anpassade avatarer",
    pricingAllLanguagesVoices: "Alla språk och röster",
    pricingDedicatedSupport: "Dedikerat stöd",
    pricingCustomBranding: "Anpassad varumärkesprofil",
    pricingTeamCollaboration: "Team-samarbete",
    pricingAdvancedAnalytics: "Avancerad analys",
    pricingWhiteLabelSolution: "White-label-lösning",
    pricingCustomIntegrations: "Anpassade integrationer",
    pricingSLAGuarantee: "SLA-garanti",
    pricingFeatureComparison: "Funktionsjämförelse",
    pricingCompareAllFeatures: "Jämför alla funktioner",
    pricingEverythingYouNeed: "Allt du behöver för att välja rätt plan",
    pricingFeatures: "Funktioner",
    pricingVideoCreation: "Videoskapande",
    pricingAvatarsVoices: "Avatarer och röster",
    pricingSupport: "Stöd",
    pricingVideosPerMonth: "Videor per månad",
    pricingVideoQuality: "Videokvalitet",
    pricingVideoDuration: "Videolängd",
    pricingExportFormats: "Exportformat",
    pricingAvailableAvatars: "Tillgängliga avatarer",
    pricingVoiceOptions: "Röstalternativ",
    pricingVoiceQuality: "Röstkvalitet",
    pricingCustomVoices: "Anpassade röster",
    pricingBackgroundOptions: "Bakgrundsalternativ",
    pricingEmailSupport: "E-poststöd",
    pricingFrequentlyAsked: "Vanliga frågor",
    pricingQuestions: "frågor",
    pricingEverythingYouNeedToKnow: "Allt du behöver veta om vår prissättning",
    pricingCanChangePlanAnytime: "Kan jag ändra min plan när som helst?",
    pricingCanChangePlanAnytimeAnswer: "Ja, du kan uppgradera eller nedgradera din plan när som helst. Ändringar träder i kraft omedelbart, och vi kommer att proportionera eventuella faktureringsskillnader.",
    pricingWhatHappensToVideos: "Vad händer med mina videor om jag nedgraderar?",
    pricingWhatHappensToVideosAnswer: "Dina befintliga videor förblir tillgängliga. Du får bara reducerade gränser för ny videoproduktion baserat på din nya plan.",
    pricingDoYouOfferRefunds: "Erbjuder ni återbetalningar?",
    pricingDoYouOfferRefundsAnswer: "Vi erbjuder en 30-dagars pengarna-tillbaka-garanti för alla betalda planer. Kontakta vårt supportteam om du inte är nöjd.",
    pricingCanCancelSubscription: "Kan jag avsluta min prenumeration?",
    pricingCanCancelSubscriptionAnswer: "Ja, du kan avsluta när som helst från dina kontoinställningar. Din prenumeration förblir aktiv till slutet av din faktureringsperiod.",
    pricingCustomEnterpriseSolutions: "Erbjuder ni anpassade företagslösningar?",
    pricingCustomEnterpriseSolutionsAnswer: "Absolut! Kontakta vårt säljteam för att diskutera anpassad prissättning, funktioner och integrationer för din organisation.",
    pricingGetStarted: "Kom igång",
    pricingReadyToCreate: "Redo att skapa fantastiska AI-videor?",
    pricingJoinThousands: "Gå med tusentals skapare och företag som redan använder vår plattform för att skapa professionella AI-avatarvideor.",
    pricingStartFreeTrial: "Starta gratis provperiod",
    pricingContactSales: "Kontakta försäljning",
    pricingSavePerYear: "Spara $/år",
    pricingForever: "för alltid",
    pricingMonth: "månad",
    pricingYear: "år",
    
    // Studio Wizard Components
    studioChooseAvatar: "Välj Avatar",
    studioSelectPresenter: "Välj Presentatör",
    studioLanguageVoice: "Språk & Röst",
    studioPickLanguage: "Välj Språk",
    studioBackgrounds: "Bakgrunder",
    studioChooseScenes: "Välj Scener",
    studioScript: "Manus",
    studioWriteMessage: "Skriv Meddelande",
    studioGenerate: "Generera",
    studioCreateVideo: "Skapa Video",
    studioPreview: "Förhandsvisning",
    studioReviewDownload: "Granska & Ladda ner",
    studioStep: "Steg",
    studioOf: "av",
    studioAccessDenied: "Åtkomst Nekad",
    studioSignInRequired: "Logga in krävs för att komma åt studion",
    studioSignIn: "Logga in",
    
    // Avatar Step
    studioChooseYourAvatar: "Välj din avatar",
    studioSelectVirtualPresenter: "Välj en virtuell presentatör som kommer att leverera ditt meddelande.",
    studioEachAvatarUnique: "Varje avatar har en unik personlighet och talstil.",
    studioPreview: "Förhandsvisning",
    studioWillPresentVideo: "kommer att presentera din video",
    studioContinue: "Fortsätt",
    
    // Language Step
    studioLanguageVoice: "Språk & Röst",
    studioChooseLanguageVoice: "Välj språk och röst för din video.",
    studioPreviewEachVoice: "Du kan förhandsgranska varje röst innan du väljer.",
    studioSelectLanguage: "Välj Språk",
    studioChooseVoice: "Välj Röst",
    studioAllTones: "Alla Toner",
    studioProfessional: "Professionell",
    studioEnergetic: "Energisk",
    studioCalm: "Lugn",
    studioExpressive: "Uttrycksfull",
    studioPlaying: "Spelar...",
    studioPreview: "Förhandsvisning",
    studioSelectedVoice: "Vald Röst",
    studioBack: "Tillbaka",
    studioContinue: "Fortsätt",
    
    // Background Step
    studioChooseBackgrounds: "Välj Bakgrunder",
    studioSelectMultipleBackgrounds: "Välj flera bakgrunder för din video.",
    studioChoose2To4Scenes: "Du kan välja 2-4 olika scener för att skapa dynamiska övergångar.",
    studioAll: "Alla",
    studioProfessional: "Professionell",
    studioCasual: "Avslappnad",
    studioCreative: "Kreativ",
    studioBackgroundsSelected: "bakgrunder valda",
    studioPreview: "Förhandsvisning",
    studioPreviewMode: "Förhandsvisningsläge",
    studioExitPreview: "Avsluta Förhandsvisning",
    studioSelectedBackgrounds: "Valda Bakgrunder",
    studioMoreBackgrounds: "fler bakgrunder",
    studioBack: "Tillbaka",
    studioContinue: "Fortsätt",
    
    // Text Step
    studioWriteYourScript: "Skriv ditt manus",
    studioWriteTextAvatarSpeak: "Skriv texten som din avatar ska tala.",
    studioStartWithTemplate: "Du kan börja med en mall eller skriva ditt eget innehåll.",
    studioQuickTemplates: "Snabbmallar",
    studioWelcomeMessage: "Välkomstmeddelande",
    studioProductIntroduction: "Produktintroduktion",
    studioTrainingIntroduction: "Utbildningsintroduktion",
    studioCompanyAnnouncement: "Företagsmeddelande",
    studioTutorialIntroduction: "Tutorialintroduktion",
    studioSpecialOffer: "Specialerbjudande",
    studioBusiness: "Företag",
    studioMarketing: "Marknadsföring",
    studioEducation: "Utbildning",
    studioYourScript: "Ditt Manus",
    studioWords: "ord",
    studioCharacters: "tecken",
    studioDuration: "varaktighet",
    studioShort: "Kort",
    studioMedium: "Medium",
    studioLong: "Lång",
    studioWriteScriptHere: "Skriv ditt manus här... Din avatar kommer att tala denna text naturligt.",
    studioWritingTips: "Skrivtips",
    studioNaturalSpeech: "Naturligt Tal",
    studioWriteAsYouSpeak: "Skriv som du skulle tala naturligt, med pauser och betoning.",
    studioOptimalLength: "Optimal Längd",
    studioKeepVideos30To120: "Håll videor mellan 30-120 sekunder för bäst engagemang.",
    studioClearStructure: "Tydlig Struktur",
    studioStartWithHook: "Börja med en krok, leverera ditt meddelande och avsluta med en uppmaning till handling.",
    studioPronunciation: "Uttal",
    studioUsePhoneticSpelling: "Använd fonetisk stavning för svåra ord: \"AI\" som \"A-I\".",
    studioPreview: "Förhandsvisning",
    studioBack: "Tillbaka",
    studioContinue: "Fortsätt",
    
    // Generation Step
    studioGenerateYourVideo: "Generera Din Video",
    studioCreatePersonalizedVideo: "Vi skapar din personaliserade video med AI.",
    studioProcessTakes2To3Minutes: "Denna process tar vanligtvis 2-3 minuter.",
    studioVideoSummary: "Videosammanfattning",
    studioAvatar: "Avatar",
    studioBackground: "Bakgrund",
    studioDuration: "Varaktighet",
    studioWords: "ord",
    studioGeneratingYourVideo: "Genererar Din Video",
    studioDontCloseWindow: "Stäng inte detta fönster medan vi skapar din video.",
    studioProgress: "Framsteg",
    studioPreparingAssets: "Förbereder tillgångar",
    studioGeneratingAvatarAnimation: "Genererar avataranimation",
    studioSynthesizingVoice: "Syntetiserar röst",
    studioProcessingBackground: "Bearbetar bakgrund",
    studioCompositingVideo: "Komponerar video",
    studioFinalizingOutput: "Slutför utdata",
    studioComplete: "Klar",
    studioProcessing: "Bearbetar...",
    studioEstimatedTimeRemaining: "Uppskattad tid kvar:",
    studioCancelGeneration: "Avbryt Generering",
    studioReadyToGenerate: "Redo att Generera",
    studioVideoCreatedWithSettings: "Din video kommer att skapas med inställningarna ovan.",
    studioStartGeneration: "Starta Generering",
    studioBack: "Tillbaka",
    studioGenerationTakes2To3Minutes: "Generering tar vanligtvis 2-3 minuter",
    
    // Preview Step
    studioYourVideoReady: "Din Video är Redo!",
    studioReviewGeneratedVideo: "Granska din genererade video och ladda ner den när du är nöjd med resultatet.",
    studioDownloadWhenSatisfied: "Ladda ner den när du är nöjd med resultatet.",
    studioPlaying: "Spelar...",
    studioClickToPreview: "Klicka för förhandsvisning",
    studioDuration: "Varaktighet",
    studioQuality: "Kvalitet",
    studioFormat: "Format",
    studioFileSize: "Filstorlek",
    studioVideoSettings: "Videoinställningar",
    studioVoice: "Röst",
    studioBackground: "Bakgrund",
    studioResolution: "Upplösning",
    studioScriptLength: "Manuslängd",
    studioScript: "Manus",
    studioActions: "Åtgärder",
    studioDownloading: "Laddar ner...",
    studioDownloadVideo: "Ladda ner Video",
    studioRegenerate: "Återgenerera",
    studioSaveContinue: "Spara & Fortsätt",
    studioDownloadProgress: "Nedladdningsframsteg",
    studioBack: "Tillbaka",
    studioVideoGeneratedSuccessfully: "Video genererad framgångsrikt",
    
    // About Page
    aboutTitle: "Om MarketUp",
    aboutWelcome: "Välkommen till MarketUp, en europeisk plattform designad för att hjälpa alla — från små butiksägare och kaféer till stora företag — att marknadsföra sin verksamhet",
    aboutEasilyAffordably: "enkelt och prisvärt.",
    aboutEuropeanPlatform: "Europeisk plattform",
    aboutForEveryone: "För alla",
    aboutEasyAffordable: "Enkelt & prisvärt",
    aboutOurMissionVision: "Vårt Uppdrag & Vision",
    aboutDrivingInnovation: "Driva innovation inom marknadsföringsteknologi för",
    aboutEveryone: "alla",
    aboutOurMission: "Vårt Uppdrag",
    aboutMissionText: "Vårt uppdrag är att ge individer och företag möjlighet att marknadsföra sina produkter eller tjänster utan behov av dyra reklambyråer — bara enkel, smart och effektiv marknadsföring.",
    aboutOurVision: "Vår Vision",
    aboutVisionText: "Vår vision för framtiden är att expandera MarketUp på nya och innovativa sätt som gör marknadsföring ännu enklare och kraftfullare för alla användare.",
    aboutWhatMakesDifferent: "Vad Som Gör Oss Annorlunda",
    aboutDifferentText: "Vad som gör oss annorlunda är vår fokus på",
    aboutSimplicityQualityAccessibility: "enkelhet, kvalitet och tillgänglighet.",
    aboutWhatMarketUpOffers: "Vad MarketUp Erbjuder",
    aboutComprehensiveSolutions: "Omfattande lösningar för alla dina",
    aboutMarketingNeeds: "marknadsföringsbehov",
    aboutSmartAIVideo: "Smart AI-driven videokreation",
    aboutForMarketing: "för marknadsföring",
    aboutAffordablePricing: "Prisvärda prissättningsplaner",
    aboutSuitableForAll: "lämpliga för alla användare",
    aboutMultilingualSupport: "Flera språk supportteam",
    aboutLanguages: "Engelska, Arabiska, Svenska och Turkiska",
    aboutEasyToUse: "Lättanvända verktyg",
    aboutMakeVideoMarketing: "som gör videomarknadsföring snabbare, mer kreativ och inom allas räckhåll",
    aboutActive: "Aktiv",
    aboutOurCommitment: "Vårt Engagemang",
    aboutCommitmentText: "Vi strävar efter att ge kontinuerlig support, smartare verktyg och kreativa lösningar för att leverera den bästa möjliga upplevelsen för varje kund.",
    aboutQuote: "MarketUp – där dina idéer blir marknadsföringskraft",
    aboutOurSlogans: "Våra Slogans",
    aboutSlogan: "Slogan",
    aboutSloganText: "MarketUp – din verksamhet förtjänar att bli sedd",
    aboutTagline: "Tagline",
    aboutTaglineText: "Din historia, vår teknologi – en vision för framgång",
    aboutReadyToTransform: "Redo att förvandla din",
    aboutMarketing: "marknadsföring?",
    aboutJoinThousands: "Gå med tusentals företag som redan använder MarketUp för att skapa professionella marknadsföringsvideor.",
    aboutGetStarted: "Kom igång",
    aboutSeePricing: "Se prissättning",
    
    // Dashboard Page
    dashboardWelcomeBack: "Välkommen tillbaka,",
    dashboardCreator: "Skapare!",
    dashboardTotalVideos: "Totalt antal videor",
    dashboardThisMonth: "denna månad",
    dashboardCurrentPlan: "Nuvarande plan",
    dashboardFreePlan: "Gratis plan",
    dashboardUpgradeToPro: "Uppgradera till Pro",
    dashboardStorageUsed: "Använt lagringsutrymme",
    dashboardOfUsed: "av",
    dashboardCompleted: "Slutförda",
    dashboardReadyToView: "Redo att visa",
    dashboardProcessing: "Bearbetar",
    dashboardInProgress: "Pågår",
    dashboardTotalViews: "Totalt antal visningar",
    dashboardAllTime: "Genom tiderna",
    dashboardDownloads: "Nedladdningar",
    dashboardQuickActions: "Snabbåtgärder",
    dashboardCreateVideo: "Skapa video",
    dashboardStartNewProject: "Starta ett nytt videoprojekt",
    dashboardMyVideos: "Mina videor",
    dashboardViewAllVideos: "Visa alla dina videor",
    dashboardUpgradePlan: "Uppgradera plan",
    dashboardManageSubscription: "Hantera din prenumeration",
    dashboardSettings: "Inställningar",
    dashboardAccountPreferences: "Kontoinställningar",
    dashboardRecentVideos: "Senaste videor",
    dashboardViewAll: "Visa alla →",
    dashboardViews: "visningar",
    dashboardNoVideosYet: "Inga videor än",
    dashboardCreateFirstVideo: "Skapa din första video för att komma igång",
    
    // Profile Page
    profileAnonymousUser: "Anonym användare",
    profileNotSet: "Inte inställt",
    profileCancel: "Avbryt",
    profileEditProfile: "Redigera profil",
    profilePersonalInformation: "Personlig information",
    profileFullName: "Fullständigt namn",
    profileEnterFullName: "Ange ditt fullständiga namn",
    profileEmailAddress: "E-postadress",
    profileEnterEmail: "Ange din e-post",
    profileEmailCannotBeChanged: "E-post kan inte ändras",
    profileBio: "Biografi",
    profileTellAboutYourself: "Berätta om dig själv...",
    profileCountry: "Land",
    profileSelectCountry: "Välj ditt land",
    profileLanguage: "Språk",
    profileSelectLanguage: "Välj ditt språk",
    profileCompany: "Företag",
    profileCompanyName: "Ditt företagsnamn",
    profileWebsite: "Webbplats",
    profileWebsiteUrl: "https://dinwebbplats.com",
    profileSaving: "Sparar...",
    profileSaveChanges: "Spara ändringar",
    profileProfileStats: "Profilstatistik",
    profileProfileCompletion: "Profilfullständighet",
    profileVideos: "Videor",
    profileProjects: "Projekt",
    profileAccountSettings: "Kontoinställningar",
    profileChangePassword: "Ändra lösenord",
    profileUpdatePassword: "Uppdatera ditt lösenord",
    profileTwoFactorAuth: "Tvåfaktorsautentisering",
    profileAddExtraSecurity: "Lägg till extra säkerhet",
    profileDeleteAccount: "Ta bort konto",
    profilePermanentlyDeleteAccount: "Ta bort konto permanent",
    
    // Videos Page
    videosMyVideos: "Mina videor",
    videosManageViewAll: "Hantera och visa alla dina skapade videor",
    videosCreateNewVideo: "Skapa ny video",
    videosSearchVideos: "Sök videor...",
    videosAll: "Alla",
    videosCompleted: "Slutförda",
    videosProcessing: "Bearbetar",
    videosQueued: "Köade",
    videosLoadingVideos: "Laddar videor...",
    videosStatus: "Status",
    videosDuration: "Varaktighet",
    videosViews: "Visningar",
    videosDownloads: "Nedladdningar",
    videosView: "Visa",
    videosEdit: "Redigera",
    videosDownload: "Ladda ner",
    videosShare: "Dela",
    videosDuplicate: "Duplicera",
    videosDelete: "Ta bort",
    videosProcessingStatus: "Bearbetar...",
    videosNoVideosFound: "Inga videor hittades",
    videosTryAdjustingSearch: "Försök justera dina söktermer",
    videosCreateFirstVideo: "Skapa din första video för att komma igång",
    videosCreateVideo: "Skapa video",
    videosPage: "Sida",
    videosOf: "av",
    videosPrevious: "Föregående",
    videosPrev: "Föreg",
    videosNext: "Nästa",
    videosDownloadFunctionalityComingSoon: "Nedladdningsfunktionalitet kommer snart!",
    videosShareFunctionalityComingSoon: "Delningsfunktionalitet kommer snart!",
    videosDeleteFunctionalityComingSoon: "Borttagningsfunktionalitet kommer snart!",
    videosDuplicateFunctionalityComingSoon: "Dupliceringsfunktionalitet kommer snart!",
    videosAreYouSureDelete: "Är du säker på att du vill ta bort denna video?",
    
    // Subscription Page
    subscriptionManagement: "Prenumerationshantering",
    subscriptionManageBillingUpgrade: "Hantera din prenumeration, fakturering och uppgradera din plan för att låsa upp fler funktioner",
    subscriptionCurrentPlan: "Nuvarande plan",
    subscriptionManageSubscriptionBilling: "Hantera din prenumeration och fakturering",
    subscriptionCancelling: "Avslutas",
    subscriptionEnds: "Slutar",
    subscriptionNextBilling: "Nästa fakturering",
    subscriptionUsageThisMonth: "Användning denna månad",
    subscriptionVideosCreated: "Videor skapade",
    subscriptionUsed: "använd",
    subscriptionChangePlan: "Ändra plan",
    subscriptionUpdatePayment: "Uppdatera betalning",
    subscriptionCancelSubscription: "Avsluta prenumeration",
    subscriptionReactivate: "Återaktivera",
    subscriptionUpgradePlan: "Uppgradera plan",
    subscriptionAvailablePlans: "Tillgängliga planer",
    subscriptionChoosePlanBestFits: "Välj den plan som bäst passar dina behov och lås upp fler funktioner",
    subscriptionMostPopular: "Mest populär",
    subscriptionChoosePlan: "Välj plan",
    subscriptionBillingHistory: "Faktureringshistorik",
    subscriptionTrackPaymentHistory: "Spåra din betalningshistorik och ladda ner fakturor",
    subscriptionDownload: "Ladda ner",
    subscriptionNoBillingHistory: "Ingen faktureringshistorik",
    subscriptionBillingHistoryWillAppear: "Din faktureringshistorik kommer att visas här",
    subscriptionErrorLoadingData: "Fel vid laddning av prenumerationsdata",
    subscriptionPleaseTryRefreshing: "Försök uppdatera sidan",
    subscriptionRefreshPage: "Uppdatera sida",
    subscriptionChangePlanFunctionalityComingSoon: "Funktionalitet för att ändra plan kommer snart!",
    subscriptionUpdatePaymentFunctionalityComingSoon: "Funktionalitet för att uppdatera betalning kommer snart!",
    subscriptionCancelSubscriptionFunctionalityComingSoon: "Funktionalitet för att avsluta prenumeration kommer snart!",
    subscriptionUpgradePlanFunctionalityComingSoon: "Funktionalitet för att uppgradera plan kommer snart!",
    subscriptionDownloadInvoiceFunctionalityComingSoon: "Funktionalitet för att ladda ner faktura kommer snart!",
    subscriptionUpgradeToPlanFunctionalityComingSoon: "Uppgradera till {plan} plan funktionalitet kommer snart!",
    
    // Billing Page
    billingInvoices: "Fakturering & Fakturor",
    billingManageBillingInformation: "Hantera din faktureringsinformation, betalningsmetoder och spåra din användning",
    billingOverview: "Översikt",
    billingPaymentMethods: "Betalningsmetoder",
    billingUsage: "Användning",
    billingErrorLoadingData: "Fel vid laddning av faktureringsdata",
    billingPleaseTryRefreshing: "Försök uppdatera sidan",
    billingRefreshPage: "Uppdatera sida",
    billingCurrentBillingPeriod: "Nuvarande faktureringsperiod",
    billingPeriod: "Period",
    billingCurrentBillingCycle: "Nuvarande faktureringscykel",
    billingAmount: "Belopp",
    billingStatus: "Status",
    billingFreePlan: "Gratis plan",
    billingAutoRenewalEnabled: "Automatisk förnyelse aktiverad",
    billingUsageThisMonth: "Användning denna månad",
    billingVideosCreated: "Videor skapade",
    billingOf: "av",
    billingStorageUsed: "Lagring använd",
    billingBandwidth: "Bandbredd",
    billingThisMonth: "denna månad",
    billingInvoiceHistory: "Fakturahistorik",
    billingNoInvoicesYet: "Inga fakturor än",
    billingInvoiceHistoryWillAppear: "Din fakturahistorik kommer att visas här",
    billingDownload: "Ladda ner",
    billingAddPaymentMethod: "Lägg till betalningsmetod",
    billingDefault: "Standard",
    billingEdit: "Redigera",
    billingNoPaymentMethod: "Ingen betalningsmetod",
    billingAddPaymentMethodToManage: "Lägg till en betalningsmetod för att hantera din prenumeration",
    billingDetailedUsage: "Detaljerad användning",
    billingBandwidthThisMonth: "Bandbredd denna månad",
    billingUnlimited: "Obegränsat",
    
    // Settings Page
    settingsTitle: "Inställningar",
    settingsManageAccountPreferences: "Hantera dina kontopreferenser, notifieringar och säkerhetsinställningar",
    settingsMemberSince: "Medlem sedan",
    settingsSaving: "Sparar...",
    settingsSaveChanges: "Spara ändringar",
    settingsAccountInformation: "Kontoinformation",
    settingsEmail: "E-post",
    settingsName: "Namn",
    settingsCountry: "Land",
    settingsSelectCountry: "Välj land",
    settingsNotifications: "Notifieringar",
    settingsEmailNotifications: "E-postnotifieringar",
    settingsReceiveNotificationsViaEmail: "Ta emot notifieringar via e-post",
    settingsPushNotifications: "Push-notifieringar",
    settingsReceivePushNotificationsInBrowser: "Ta emot push-notifieringar i din webbläsare",
    settingsMarketingEmails: "Marknadsföringse-post",
    settingsReceiveUpdatesAboutNewFeatures: "Ta emot uppdateringar om nya funktioner och tips",
    settingsProductUpdates: "Produktuppdateringar",
    settingsGetNotifiedAboutNewFeatures: "Få notifieringar om nya funktioner och förbättringar",
    settingsPrivacySecurity: "Integritet och säkerhet",
    settingsProfileVisibility: "Profilsynlighet",
    settingsControlWhoCanSeeProfile: "Kontrollera vem som kan se din profilinformation",
    settingsPublic: "Offentlig",
    settingsPrivate: "Privat",
    settingsFriendsOnly: "Endast vänner",
    settingsAnalytics: "Analys",
    settingsHelpUsImproveBySharing: "Hjälp oss förbättra genom att dela anonym användningsdata",
    settingsDataSharing: "Datadelning",
    settingsAllowSharingDataWithPartners: "Tillåt delning av data med tredjepartspartners",
    settingsPreferences: "Preferenser",
    settingsTheme: "Tema",
    settingsDark: "Mörk",
    settingsLight: "Ljus",
    settingsAuto: "Automatisk",
    settingsLanguage: "Språk",
    settingsEnglish: "Engelska",
    settingsUkrainian: "Українська",
    settingsSpanish: "Español",
    settingsFrench: "Français",
    settingsTimezone: "Tidszon",
    settingsUTC: "UTC",
    settingsEasternTime: "Eastern Time",
    settingsPacificTime: "Pacific Time",
    settingsLondon: "London",
    settingsKiev: "Kiev",
    settingsDateFormat: "Datumformat",
    settingsMMDDYYYY: "MM/DD/YYYY",
    settingsDDMMYYYY: "DD/MM/YYYY",
    settingsYYYYMMDD: "YYYY-MM-DD",
    settingsDangerZone: "Fara-zon",
    settingsExportData: "Exportera data",
    settingsDownloadCopyOfData: "Ladda ner en kopia av dina data",
    settingsExport: "Exportera",
    settingsDeleteAccount: "Ta bort konto",
    settingsPermanentlyDeleteAccount: "Ta bort ditt konto och all data permanent",
    settingsSettingsSavedSuccessfully: "Inställningar sparade framgångsrikt!",
    settingsErrorSavingSettings: "Fel vid sparande av inställningar. Försök igen.",
    settingsDataExportFeatureComingSoon: "Dataexportfunktion kommer snart!",
    settingsAccountDeletionFeatureComingSoon: "Kontoborttagningsfunktion kommer snart!",
    settingsAreYouSureDeleteAccount: "Är du säker på att du vill ta bort ditt konto? Denna åtgärd kan inte ångras.",
    
    // Remember Me Settings
    rememberMeSettings: "Kom ihåg mig-inställningar",
    rememberMeDescription: "Kom ihåg mig låter dig stanna inloggad i upp till 30 dagar på betrodda enheter. Om du använder en delad eller offentlig dator rekommenderar vi att inte använda denna funktion.",
    rememberMeClearSessions: "Rensa kom ihåg mig-sessioner",
    rememberMeClearSessionsDescription: "Detta kommer att logga ut dig från alla enheter där du har valt att bli ihågkommen.",
    rememberMeClearing: "Rensar...",
    rememberMeClearAllSessions: "Rensa alla sessioner",
    rememberMeSessionsClearedSuccessfully: "Kom ihåg mig-sessioner rensade framgångsrikt",
    rememberMeFailedToClearSessions: "Misslyckades med att rensa kom ihåg mig-sessioner",
    rememberMeErrorOccurred: "Ett fel uppstod vid rensning av sessioner",
    
    // Dashboard Sidebar
    dashboardSidebarTitle: "Instrumentpanel",
    dashboardSidebarWelcomeBack: "Välkommen tillbaka",
    dashboardSidebarOverview: "Översikt",
    dashboardSidebarProfile: "Profil",
    dashboardSidebarVideos: "Videor",
    dashboardSidebarSubscription: "Prenumeration",
    dashboardSidebarBilling: "Fakturering",
    dashboardSidebarSettings: "Inställningar",
    dashboardSidebarAccount: "Konto",
    dashboardSidebarSignOut: "Logga ut",
    dashboardSidebarManageAccount: "Hantera ditt konto och inställningar",
    
    // Admin Panel
    adminOverview: "Översikt av dina plattformsmetriker och analyser",
    adminOverviewDescription: "Översikt av dina plattformsmetriker och analyser",
    adminExportReport: "Exportera rapport",
    adminRefreshing: "Uppdaterar...",
    adminRefreshData: "Uppdatera data",
    adminTotalUsers: "Totalt antal användare",
    adminTotalRevenue: "Total intäkt",
    adminVideosCreated: "Skapade videor",
    adminActiveUsers: "Aktiva användare",
    adminRevenueTrend: "Intäktsutveckling",
    adminRevenue: "Intäkt",
    adminUserActivity: "Användaraktivitet",
    adminActiveUsers: "Aktiva användare",
    adminChartVisualizationComingSoon: "Diagramvisualisering kommer snart",
    adminRecentActivity: "Senaste aktivitet",
    adminNoRecentActivity: "Ingen senaste aktivitet",
    adminActivityWillAppearHere: "Aktivitet kommer att visas här när användare interagerar med plattformen",
    adminErrorLoadingData: "Fel vid laddning av admin-data",
    adminTryAgain: "Försök igen",
    adminNetworkErrorOccurred: "Nätverksfel uppstod",
    
    // Admin Users Management
    adminUsersManagement: "Användarhantering",
    adminUsersManagementDescription: "Hantera plattformsanvändare, deras konton och behörigheter",
    adminAddUser: "Lägg till användare",
    adminSearchFilters: "Sök & Filter",
    adminSearchUsers: "Sök användare...",
    adminAllStatus: "Alla statusar",
    adminActive: "Aktiv",
    adminInactive: "Inaktiv",
    adminSuspended: "Avstängd",
    adminAllSubscriptions: "Alla prenumerationer",
    adminFree: "Gratis",
    adminBasic: "Grundläggande",
    adminPremium: "Premium",
    adminEnterprise: "Företag",
    adminSortByJoinDate: "Sortera efter anslutningsdatum",
    adminSortByName: "Sortera efter namn",
    adminSortByEmail: "Sortera efter e-post",
    adminSortByLastActive: "Sortera efter senaste aktivitet",
    adminSortByVideos: "Sortera efter videor",
    adminSortByTotalSpent: "Sortera efter totalt spenderat",
    adminUsersSelected: "användare valda",
    adminUserSelected: "användare vald",
    adminActivate: "Aktivera",
    adminSuspend: "Stäng av",
    adminDelete: "Ta bort",
    adminClear: "Rensa",
    adminUser: "Användare",
    adminStatus: "Status",
    adminSubscription: "Prenumeration",
    adminVideos: "Videor",
    adminTotalSpent: "Totalt spenderat",
    adminLastActive: "Senast aktiv",
    adminActions: "Åtgärder",
    adminShowingUsers: "Visar",
    adminOfUsers: "av",
    adminPrevious: "Föregående",
    adminNext: "Nästa",
    adminEditUser: "Redigera användare",
    adminName: "Namn",
    adminEmail: "E-post",
    adminRole: "Roll",
    adminUserRole: "Användare",
    adminAdminRole: "Administratör",
    adminModeratorRole: "Moderator",
    adminSaveChanges: "Spara ändringar",
    adminCancel: "Avbryt",
    adminUserUpdatedSuccessfully: "Användare uppdaterad framgångsrikt!",
    adminFailedToUpdateUser: "Misslyckades att uppdatera användare:",
    adminErrorUpdatingUser: "Fel vid uppdatering av användare",
    adminAreYouSureDeleteUsers: "Är du säker på att du vill ta bort",
    adminUsersDeletedSuccessfully: "användare borttagna framgångsrikt!",
    adminFailedToDeleteUsers: "Misslyckades att ta bort användare:",
    adminErrorPerformingAction: "Fel vid utförande av",
    adminActionComingSoon: "åtgärd för",
    
    // Admin Videos Management
    adminVideosModeration: "Videomoderering",
    adminVideosModerationDescription: "Granska och moderera videoinnehåll som laddats upp av användare",
    adminVideosToReview: "videor att granska",
    adminVideosSearchFilters: "Sök & Filter",
    adminVideosSearch: "Sök",
    adminVideosSearchPlaceholder: "Sök videor eller uppladdare...",
    adminVideosStatus: "Status",
    adminVideosAllStatus: "Alla Statusar",
    adminVideosPending: "Väntande",
    adminVideosApproved: "Godkänd",
    adminVideosRejected: "Avvisad",
    adminVideosSortBy: "Sortera efter",
    adminVideosUploadDate: "Uppladdningsdatum",
    adminVideosTitle: "Titel",
    adminVideosUploader: "Uppladdare",
    adminVideosFlags: "Flaggor",
    adminVideosOrder: "Ordning",
    adminVideosNewestFirst: "Nyast först",
    adminVideosOldestFirst: "Äldst först",
    adminVideosReview: "Granska",
    adminVideosReason: "Anledning",
    adminVideosViews: "visningar",
    adminVideosLikes: "gilla-markeringar",
    adminVideosFlagsCount: "flaggor",
    adminVideosReviewVideo: "Granska Video",
    adminVideosVideoInformation: "Videoinformation",
    adminVideosDuration: "Varaktighet",
    adminVideosCategory: "Kategori",
    adminVideosUploadDate: "Uppladdningsdatum",
    adminVideosFlagsCount: "Flaggor",
    adminVideosUploaderInformation: "Uppladdarinformation",
    adminVideosDescription: "Beskrivning",
    adminVideosTags: "Taggar",
    adminVideosReject: "Avvisa",
    adminVideosApprove: "Godkänn",
    adminVideosEnterRejectionReason: "Ange avvisningsanledning:",
    adminVideosVideoPlayer: "Videospelare",
    adminVideosClickToPlay: "Klicka för att spela",
    
    // Admin Scheduler Management
    adminSchedulerPublicationScheduler: "Publiceringsplanerare",
    adminSchedulerScheduleVideoPublications: "Schemalägg videopubliceringar på sociala nätverk",
    adminSchedulerScheduleNewPost: "+ Schemalägg Nytt Inlägg",
    adminSchedulerSearchFilters: "Sök & Filter",
    adminSchedulerStatusFilter: "Statusfilter",
    adminSchedulerAllStatus: "Alla Statusar",
    adminSchedulerScheduled: "Schemalagd",
    adminSchedulerPublished: "Publicerad",
    adminSchedulerFailed: "Misslyckades",
    adminSchedulerCancelled: "Avbruten",
    adminSchedulerSocialNetwork: "Socialt Nätverk",
    adminSchedulerAllNetworks: "Alla Nätverk",
    adminSchedulerDuration: "Varaktighet",
    adminSchedulerCategory: "Kategori",
    adminSchedulerPublishesIn: "Publiceras om",
    adminSchedulerPublishNow: "Publicera Nu",
    adminSchedulerCancel: "Avbryt",
    adminSchedulerScheduleNewPost: "Schemalägg Nytt Inlägg",
    adminSchedulerSelectVideo: "Välj Video *",
    adminSchedulerSelectSocialNetworks: "Välj Sociala Nätverk *",
    adminSchedulerPublicationDate: "Publiceringsdatum *",
    adminSchedulerPublicationTime: "Publiceringstid *",
    adminSchedulerCustomMessage: "Anpassat Meddelande",
    adminSchedulerCustomMessageOptional: "Anpassat Meddelande (Valfritt)",
    adminSchedulerCustomMessagePlaceholder: "Lägg till ett anpassat meddelande som följer med din video...",
    adminSchedulerCancel: "Avbryt",
    adminSchedulerSchedulePost: "Schemalägg Inlägg",
    adminSchedulerScheduling: "Schemalägger...",
    adminSchedulerPleaseSelectVideo: "Välj en video",
    adminSchedulerPleaseSelectNetwork: "Välj minst ett socialt nätverk",
    adminSchedulerPleaseSelectDate: "Välj ett publiceringsdatum",
    adminSchedulerPleaseSelectTime: "Välj en publiceringstid",
    adminSchedulerPostScheduledSuccessfully: "Inlägg schemalagt framgångsrikt!",
    adminSchedulerFailedToSchedulePost: "Misslyckades att schemalägga inlägg. Försök igen.",
    adminSchedulerErrorSchedulingPost: "Fel vid schemaläggning av inlägg. Försök igen.",
    adminSchedulerFailedToCancelPost: "Misslyckades att avbryta inlägg. Försök igen.",
    adminSchedulerErrorCancellingPost: "Fel vid avbrytning av inlägg. Försök igen.",
    adminSchedulerFailedToPublishPost: "Misslyckades att publicera inlägg. Försök igen.",
    adminSchedulerErrorPublishingPost: "Fel vid publicering av inlägg. Försök igen.",
    adminSchedulerOverdue: "Försenad",
    
    // Admin Payments Management
    adminPaymentsPaymentManagement: "Betalningshantering",
    adminPaymentsViewManageTransactions: "Visa och hantera betalningstransaktioner",
    adminPaymentsTransactions: "transaktioner",
    adminPaymentsSearchFilters: "Sök & Filter",
    adminPaymentsSearch: "Sök",
    adminPaymentsSearchPlaceholder: "Sök transaktioner...",
    adminPaymentsStatus: "Status",
    adminPaymentsAllStatus: "Alla Statusar",
    adminPaymentsPending: "Väntande",
    adminPaymentsCompleted: "Slutförd",
    adminPaymentsFailed: "Misslyckades",
    adminPaymentsRefunded: "Återbetalad",
    adminPaymentsCancelled: "Avbruten",
    adminPaymentsType: "Typ",
    adminPaymentsAllTypes: "Alla Typer",
    adminPaymentsSubscription: "Prenumeration",
    adminPaymentsOneTime: "Engångs",
    adminPaymentsRefund: "Återbetalning",
    adminPaymentsUpgrade: "Uppgradering",
    adminPaymentsDateRange: "Datumintervall",
    adminPaymentsAllTime: "All Tid",
    adminPaymentsToday: "Idag",
    adminPaymentsThisWeek: "Denna Vecka",
    adminPaymentsThisMonth: "Denna Månad",
    adminPaymentsThisYear: "Detta År",
    adminPaymentsTotalRevenue: "Total Intäkt",
    adminPaymentsCompleted: "Slutförd",
    adminPaymentsPending: "Väntande",
    adminPaymentsFailed: "Misslyckades",
    adminPaymentsInvoice: "Faktura",
    adminPaymentsConfirm: "Bekräfta",
    adminPaymentsCancel: "Avbryt",
    adminPaymentsRefund: "Återbetalning",
    adminPaymentsView: "Visa",
    adminPaymentsTransactionDetails: "Transaktionsdetaljer",
    adminPaymentsTransactionInformation: "Transaktionsinformation",
    adminPaymentsUserInformation: "Användarinformation",
    adminPaymentsAdditionalInformation: "Ytterligare Information",
    adminPaymentsPlan: "Plan",
    adminPaymentsBilling: "Fakturering",
    adminPaymentsDiscount: "Rabatt",
    adminPaymentsTax: "Skatt",
    adminPaymentsCancelPayment: "Avbryt Betalning",
    adminPaymentsRefund: "Återbetalning",
    adminPaymentsConfirmPayment: "Bekräfta Betalning",
    adminPaymentsEnterCancellationReason: "Ange avbrytningsanledning:",
    adminPaymentsEnterRefundReason: "Ange återbetalningsanledning:",
    adminPaymentsFailedToConfirmPayment: "Misslyckades att bekräfta betalning. Försök igen.",
    adminPaymentsErrorConfirmingPayment: "Fel vid bekräftelse av betalning. Försök igen.",
    adminPaymentsRefundFunctionalityWouldBeImplemented: "Återbetalningsfunktionalitet skulle implementeras här",
    adminPaymentsErrorProcessingRefund: "Fel vid bearbetning av återbetalning. Försök igen.",
    adminPaymentsFailedToCancelPayment: "Misslyckades att avbryta betalning. Försök igen.",
    adminPaymentsErrorCancellingPayment: "Fel vid avbrytning av betalning. Försök igen.",
    
    // Admin Tickets Management
    adminTicketsSupportTickets: "Supportärenden",
    adminTicketsManageCustomerSupport: "Hantera kundsupportärenden för premiumkunder",
    adminTicketsTickets: "ärenden",
    adminTicketsSearchFilters: "Sök & Filter",
    adminTicketsSearch: "Sök",
    adminTicketsSearchPlaceholder: "Sök ärenden...",
    adminTicketsStatus: "Status",
    adminTicketsAllStatus: "Alla Statusar",
    adminTicketsOpen: "Öppen",
    adminTicketsInProgress: "Pågående",
    adminTicketsResolved: "Löst",
    adminTicketsClosed: "Stängd",
    adminTicketsPriority: "Prioritet",
    adminTicketsAllPriority: "Alla Prioriteringar",
    adminTicketsUrgent: "Brådskande",
    adminTicketsHigh: "Hög",
    adminTicketsMedium: "Medium",
    adminTicketsLow: "Låg",
    adminTicketsCategory: "Kategori",
    adminTicketsAllCategories: "Alla Kategorier",
    adminTicketsTechnical: "Teknisk",
    adminTicketsBilling: "Fakturering",
    adminTicketsFeatureRequest: "Funktionsförfrågan",
    adminTicketsBugReport: "Felrapport",
    adminTicketsGeneral: "Allmän",
    adminTicketsSubscription: "Prenumeration",
    adminTicketsAllSubscriptions: "Alla Prenumerationer",
    adminTicketsPremium: "Premium",
    adminTicketsEnterprise: "Enterprise",
    adminTicketsTotalTickets: "Totalt Antal Ärenden",
    adminTicketsOpen: "Öppen",
    adminTicketsInProgress: "Pågående",
    adminTicketsResolved: "Löst",
    adminTicketsUrgent: "Brådskande",
    adminTicketsView: "Visa",
    adminTicketsAssignedTo: "Tilldelad till",
    adminTicketsMessages: "meddelanden",
    adminTicketsTicketInformation: "Ärendeinformation",
    adminTicketsUserInformation: "Användarinformation",
    adminTicketsDescription: "Beskrivning",
    adminTicketsConversation: "Konversation",
    adminTicketsAssignToMe: "Tilldela till Mig",
    adminTicketsTypeYourResponse: "Skriv ditt svar...",
    adminTicketsSend: "Skicka",
    adminTicketsFailedToSendMessage: "Misslyckades att skicka meddelande. Försök igen.",
    adminTicketsErrorSendingMessage: "Fel vid skickande av meddelande. Försök igen.",
    adminTicketsFailedToUpdateStatus: "Misslyckades att uppdatera status. Försök igen.",
    adminTicketsErrorUpdatingStatus: "Fel vid uppdatering av status. Försök igen.",
    adminTicketsFailedToAssignTicket: "Misslyckades att tilldela ärende. Försök igen.",
    adminTicketsErrorAssigningTicket: "Fel vid tilldelning av ärende. Försök igen.",
    adminTicketsJustNow: "Just nu",
    adminTicketsHoursAgo: "h sedan",
    adminTicketsDaysAgo: "d sedan",

    // Admin Sidebar
    adminSidebarDashboard: "Instrumentpanel",
    adminSidebarUsers: "Användare",
    adminSidebarVideoModeration: "Videomoderering",
    adminSidebarPublicationScheduler: "Publiceringsplanerare",
    adminSidebarPaymentManagement: "Betalningshantering",
    adminSidebarTicketSystem: "Ärendesystem",
    adminSidebarAdminPanel: "Adminpanel",
    adminSidebarManagePlatform: "Hantera din plattform och analyser",
    adminSidebarSignOut: "Logga ut",

    // Admin Header
    adminHeaderDashboard: "Instrumentpanel",
    adminHeaderUsers: "Användare",
    adminHeaderVideoModeration: "Videomoderering",
    adminHeaderPublicationScheduler: "Publiceringsplanerare",
    adminHeaderPaymentManagement: "Betalningshantering",
    adminHeaderTicketSystem: "Ärendesystem",
    adminHeaderAdminPanel: "Adminpanel",
    adminHeaderManagePlatform: "Hantera din plattform och analyser",
    adminHeaderSearch: "Sök",
    adminHeaderSearchPlaceholder: "Sök...",
    adminHeaderNotifications: "Notifieringar",
    adminHeaderNewUserRegistered: "Ny användare registrerad",
    adminHeaderVideoProcessingCompleted: "Videobearbetning slutförd",
    adminHeaderSystemBackupCompleted: "Systembackup slutförd",
    adminHeaderMinutesAgo: "minuter sedan",
    adminHeaderHourAgo: "timme sedan",
    adminHeaderAdminUser: "Adminanvändare",
  },
  
  uk: {
    // Navigation
    home: "Головна",
    studio: "Студія",
    pricing: "Ціни",
    about: "Про нас",
    contact: "Контакти",
    referrals: "Рекомендації",
    
    // Hero Section
    heroTitle: "Створюйте преміум AI-аватар відео менше ніж за 5 хвилин.",
    heroSubtitle: "Для кафе, ресторанів, магазинів та творців. Елегантно, футуристично, просто.",
    getStarted: "Почати",
    seePricing: "Дивитися ціни",
    
    // Trust indicators
    noCreditCard: "Кредитна карта не потрібна",
    fiveMinuteSetup: "Налаштування за 5 хвилин",
    hdQuality: "HD якість відео",
    
    // How it works
    howItWorks: "Як це працює",
    howItWorksSubtitle: "Створюйте професійні маркетингові відео всього за 4 простих кроки",
    step1Title: "Напишіть сценарій",
    step1Description: "Напишіть короткий сценарій або вставте презентацію вашого продукту. Наш AI оптимізує його для відео.",
    step2Title: "Оберіть аватар та фони",
    step2Description: "Виберіть аватар і встановіть 2-4 фони, які відповідають вашому бренду та повідомленню.",
    step3Title: "Додайте візуальні елементи",
    step3Description: "Додайте зображення продуктів, пристроїв або їжі для візуальних моментів, які залучають вашу аудиторію.",
    step4Title: "Експорт та поширення",
    step4Description: "Експортуйте відео з тонким накладанням логотипу та вашою контактною інформацією, готовою до поширення.",
    
    // Preview Section
    seeItInAction: "Подивіться в дії",
    previewSubtitle: "Подивіться, наскільки легко створювати професійні маркетингові відео",
    lightningFast: "Блискавично швидко",
    lightningFastDesc: "Генерація менше ніж за 5 хвилин",
    hdQualityTitle: "HD якість",
    hdQualityDesc: "Професійні 4K відео",
    autoPublishing: "Автоматичне публікування",
    autoPublishingDesc: "Прямо в соціальні мережі",
    
    // Pricing Section
    simplePricing: "Прості ціни",
    pricingSubtitle: "Прості плани для творців та бізнесу. Дивіться повні деталі на сторінці цін.",
    seePricingButton: "Дивитися ціни",
    startNow: "Почати зараз",
    
    // Account Menu
    account: "Акаунт",
    dashboard: "Панель",
    profile: "Профіль",
    myVideos: "Мої відео",
    subscription: "Підписка",
    settings: "Налаштування",
    adminPanel: "Адмін панель",
    signOut: "Вийти",
    
    // Footer
    footerTitle: "Готові створити чудові відео?",
    footerSubtitle: "Приєднуйтесь до тисяч творців, які використовують MarketUp",
    footerGetStarted: "Почати",
    footerFollowUs: "Слідкуйте за нами:",
    footerInstagram: "Instagram",
    footerFacebook: "Facebook",
    footerTikTok: "TikTok",
    footerCopyright: "©️ 2026 MarketUp. Всі права захищені.",
    footerContact: "Контакт:",
    footerPrivacy: "Конфіденційність",
    footerTerms: "Умови",
    footerCookies: "Cookies",
    
    // Studio Page
    studioAccessDenied: "Доступ заборонено",
    studioSignInRequired: "Увійдіть, щоб створювати відео",
    studioSignIn: "Увійти",
    studioStep: "Крок",
    studioOf: "з",
    studioChooseAvatar: "Обрати аватар",
    studioSelectPresenter: "Оберіть свого віртуального ведучого",
    studioLanguageVoice: "Мова та голос",
    studioPickLanguage: "Оберіть мову та голос",
    studioBackgrounds: "Фони",
    studioChooseScenes: "Оберіть кілька сцен",
    studioScript: "Сценарій",
    studioWriteMessage: "Напишіть своє повідомлення",
    studioGenerate: "Створити",
    studioCreateVideo: "Створіть своє відео",
    studioPreview: "Попередній перегляд",
    studioReviewDownload: "Переглянути та завантажити",
    
    // Onboarding Page
    onboardingWelcome: "Ласкаво просимо до MarketUp",
    onboardingGetStarted: "Давайте почнемо",
    onboardingSetupTime: "Ми допоможемо вам налаштувати акаунт за кілька простих кроків. Це займе лише 2 хвилини.",
    onboardingPersonalize: "Персоналізація",
    onboardingPersonalizeDesc: "Оберіть країну та мовні налаштування",
    onboardingConfigure: "Налаштування",
    onboardingConfigureDesc: "Налаштуйте параметри генерації відео",
    onboardingCreate: "Створення",
    onboardingCreateDesc: "Почніть створювати чудові AI відео",
    onboardingStep: "Крок",
    onboardingOf: "з",
    onboardingWhereLocated: "Де ви знаходитесь?",
    onboardingLocationDesc: "Це допомагає нам надавати релевантний контент та функції для вашого регіону.",
    onboardingWhatLanguage: "Яка ваша мова?",
    onboardingLanguageDesc: "Оберіть бажану мову для інтерфейсу та контенту.",
    onboardingBack: "Назад",
    onboardingContinue: "Продовжити",
    onboardingSkip: "Пропустити зараз",
    onboardingCompleteSetup: "Завершити налаштування",
    onboardingSettingUp: "Налаштовуємо...",
    onboardingError: "Не вдалося зберегти налаштування. Спробуйте ще раз.",
    
    // Referrals Page
    referralsCreateCode: "Створіть свій реферальний код",
    referralsGenerateLink: "Згенеруйте свою унікальну посилання",
    referralsYourUserId: "Ваш ID користувача",
    referralsUserIdPlaceholder: "наприклад, usr_123",
    referralsGenerating: "Генеруємо…",
    referralsGenerate: "Згенерувати",
    referralsCodeReady: "Ваш реферальний код готовий!",
    referralsYourCode: "Ваш код",
    referralsCopyLink: "Копіювати посилання",
    referralsShareLink: "Поділіться цим посиланням:",
    referralsRedeemCode: "Використати код",
    referralsEnterCode: "Введіть реферальний код",
    referralsCode: "Код",
    referralsCodePlaceholder: "Введіть реферальний код",
    referralsRedeeming: "Використовуємо…",
    referralsRedeem: "Використати",
    referralsSuccess: "Успіх — ласкаво просимо!",
    referralsWelcome: "Успіх — ласкаво просимо!",
    referralsInvalidCode: "Недійсний код",
    referralsNetworkError: "Помилка мережі",
    referralsProvideUserId: "Вкажіть ваш ID користувача.",
    referralsEnterCodeToRedeem: "Введіть код для використання.",
    referralsHowReferralsWork: "Як працюють реферали",
    referralsStartEarning: "почати заробляти",
    referralsGenerateStep: "Згенерувати",
    referralsGenerateDesc: "Створіть свій персональний код одним кліком.",
    referralsShareStep: "Поділитися",
    referralsShareDesc: "Надішліть своє посилання друзям або клієнтам.",
    referralsEarnStep: "Заробляти",
    referralsEarnDesc: "Отримуйте винагороди, коли вони підписуються.",
    referralsStep: "Крок",
    
    // Contact Page
    contactHearFromYou: "почути від вас",
    contactQuestionsPartnerships: "Питання, партнерство або преса — надішліть нам повідомлення, і ми швидко відповімо.",
    contactResponseTime: "Зазвичай ми відповідаємо протягом 24 годин.",
    contact24hResponse: "Час відповіді 24 години",
    contactExpertSupport: "Експертна підтримка",
    contactNoSpam: "Ніякого спаму",
    contactGetInTouch: "Зв'яжіться з нами",
    contactSendMessage: "Надішліть нам повідомлення, і ми зв'яжемося з вами протягом 24 годин",
    contactThanksMessage: "Дякуємо! Ваше повідомлення надіслано.",
    contactResponseTimeDesc: "Зазвичай ми відповідаємо протягом 24 годин.",
    contactSendAnother: "Надіслати ще одне",
    contactName: "Ім'я",
    contactNamePlaceholder: "Ваше ім'я",
    contactEmail: "Електронна пошта",
    contactEmailPlaceholder: "ви@компанія.ua",
    contactMessage: "Повідомлення",
    contactMessagePlaceholder: "Як ми можемо допомогти?",
    contactNoBotsSpam: "Ніяких ботів, ніякого спаму. Ми використовуватимемо вашу електронну пошту лише для відповіді.",
    contactFillAllFields: "Будь ласка, заповніть усі поля.",
    contactValidEmail: "Введіть дійсну адресу електронної пошти.",
    contactMessageLength: "Повідомлення має містити принаймні 10 символів.",
    contactSending: "Надсилаємо...",
    contactSendMessage: "Надіслати повідомлення",
    contactClear: "Очистити",
    contactSomethingWrong: "Щось пішло не так. Спробуйте ще раз.",
    contactOtherWays: "Інші способи зв'язатися з нами",
    contactBusinessHours: "Робочі години",
    contactBusinessHoursDesc: "Пн-Пт, 9:00-18:00 EST",
    contactResponseTimeLabel: "Час відповіді",
    contactResponseTimeValue: "Протягом 24 годин",
    contactEmailSupport: "Підтримка електронною поштою",
    contactGetHelpEmail: "Отримати допомогу електронною поштою",
    contactOnlineNow: "Онлайн зараз",
    contactEmailDescription: "Надішліть нам електронний лист, і ми зв'яжемося з вами протягом 24 годин. Ідеально для детальних питань, відгуків або запитів на підтримку.",
    contactEmailButton: "support@marketup.app",
    contactEmailSupportMobile: "Підтримка електронною поштою",
    contact24hResponseLabel: "24г відповідь",
    contactExpertSupportLabel: "Експертна підтримка",
    contactWhatsAppSupport: "Підтримка WhatsApp",
    contactComingSoon: "Незабаром",
    contactInDevelopment: "В розробці",
    contactWhatsAppDescription: "Підтримка WhatsApp буде доступна незабаром для миттєвих повідомлень та швидких питань.",
    contactWhatsAppButton: "WhatsApp (Незабаром)",
    contactWhatsAppMobile: "WhatsApp",
    contactInstantChat: "Миттєвий чат",
    contactFrequentlyAsked: "Часті питання",
    contactQuestions: "питання",
    contactQuickAnswers: "Швидкі відповіді на поширені питання про нашу",
    contactAIVideoPlatform: "AI відео платформу",
    contactHowLong: "Скільки часу це займає?",
    contactHowLongDesc: "Наш AI генерує професійні маркетингові відео менше ніж за 5 хвилин. Напишіть сценарій, оберіть аватар та фони, додайте візуальні елементи та експортуйте HD відео готове до поширення.",
    contactUnder5Minutes: "Менше 5 хвилин",
    contactHDQuality: "HD якість",
    contactVideoQuality: "Якість відео?",
    contactVideoQualityDesc: "Ми генеруємо відео HD якості (1080p) з професійними AI аватарами. Всі відео оптимізовані для платформ соціальних мереж та доступні для завантаження в різних форматах.",
    contact1080pHD: "1080p HD",
    contactMultipleFormats: "Кілька форматів",
    contactCustomVoice: "Власний голос?",
    contactCustomVoiceDesc: "Наразі використовуємо AI-генеровані голоси, які звучать природно та професійно. Функції клонування голосу незабаром для персоналізованих відео з вашим власним голосом.",
    contactComingSoonLabel: "Незабаром",
    contactAIVoicesNow: "AI голоси зараз",
    contactCommercialUse: "Комерційне використання?",
    contactCommercialUseDesc: "Так! Всі плани включають права на комерційне використання. Використовуйте згенеровані відео для маркетингу, реклами, соціальних мереж та будь-яких бізнес-цілей без додаткових ліцензійних зборів.",
    contactCommercialRights: "Комерційні права",
    contactNoExtraFees: "Без додаткових зборів",
    
    // Pricing Page
    pricingTransparentPricing: "Прозора ціноутворення",
    pricingSimpleTransparent: "Проста, прозора ціноутворення",
    pricingChoosePerfectPlan: "Оберіть ідеальний план для ваших потреб створення AI відео.",
    pricingNoHiddenFees: "Ніяких прихованих зборів, скасуйте будь-коли.",
    pricingMonthly: "Щомісячно",
    pricingYearly: "Щорічно",
    pricingSave20: "Економте 20%",
    pricingFree: "Безкоштовно",
    pricingPro: "Pro",
    pricingEnterprise: "Enterprise",
    pricingPerfectForGettingStarted: "Ідеально для початку",
    pricingBestForProfessionals: "Найкраще для професіоналів та творців",
    pricingForTeamsOrganizations: "Для команд та великих організацій",
    pricingMostPopular: "Найпопулярніший",
    pricingEnterpriseBadge: "Enterprise",
    pricingGetStartedFree: "Почніть безкоштовно",
    pricingStartProTrial: "Почніть Pro пробний період",
    pricingContactSales: "Зв'яжіться з продажами",
    pricing3VideosPerMonth: "3 відео на місяць",
    pricingStandardQuality720p: "Стандартна якість (720p)",
    pricingBasicAvatars: "Базові аватари",
    pricing5Languages: "5 мов",
    pricingCommunitySupport: "Підтримка спільноти",
    pricingWatermarkOnVideos: "Водяний знак на відео",
    pricing50VideosPerMonth: "50 відео на місяць",
    pricingHDQuality1080p: "HD якість (1080p)",
    pricingAllAvatarsVoices: "Всі аватари та голоси",
    pricing20PlusLanguages: "20+ мов",
    pricingPrioritySupport: "Пріоритетна підтримка",
    pricingNoWatermark: "Без водяного знака",
    pricingCustomBackgrounds: "Власні фони",
    pricingAdvancedEditingTools: "Розширені інструменти редагування",
    pricingAPIAccess: "Доступ до API",
    pricingUnlimitedVideos: "Необмежені відео",
    pricing4KQuality2160p: "4K якість (2160p)",
    pricingCustomAvatars: "Власні аватари",
    pricingAllLanguagesVoices: "Всі мови та голоси",
    pricingDedicatedSupport: "Персональна підтримка",
    pricingCustomBranding: "Власний брендинг",
    pricingTeamCollaboration: "Командна співпраця",
    pricingAdvancedAnalytics: "Розширена аналітика",
    pricingWhiteLabelSolution: "White-label рішення",
    pricingCustomIntegrations: "Власні інтеграції",
    pricingSLAGuarantee: "SLA гарантія",
    pricingFeatureComparison: "Порівняння функцій",
    pricingCompareAllFeatures: "Порівняйте всі функції",
    pricingEverythingYouNeed: "Все, що вам потрібно для вибору правильного плану",
    pricingFeatures: "Функції",
    pricingVideoCreation: "Створення відео",
    pricingAvatarsVoices: "Аватари та голоси",
    pricingSupport: "Підтримка",
    pricingVideosPerMonth: "Відео на місяць",
    pricingVideoQuality: "Якість відео",
    pricingVideoDuration: "Тривалість відео",
    pricingExportFormats: "Формати експорту",
    pricingAvailableAvatars: "Доступні аватари",
    pricingVoiceOptions: "Варіанти голосу",
    pricingVoiceQuality: "Якість голосу",
    pricingCustomVoices: "Власні голоси",
    pricingBackgroundOptions: "Варіанти фону",
    pricingEmailSupport: "Підтримка електронною поштою",
    pricingFrequentlyAsked: "Часті питання",
    pricingQuestions: "питання",
    pricingEverythingYouNeedToKnow: "Все, що вам потрібно знати про наше ціноутворення",
    pricingCanChangePlanAnytime: "Чи можу я змінити свій план будь-коли?",
    pricingCanChangePlanAnytimeAnswer: "Так, ви можете оновити або знизити свій план будь-коли. Зміни набувають чинності негайно, і ми пропорційно розрахуємо будь-які різниці в оплаті.",
    pricingWhatHappensToVideos: "Що станеться з моїми відео, якщо я знижу план?",
    pricingWhatHappensToVideosAnswer: "Ваші існуючі відео залишаються доступними. Ви просто матимете зменшені обмеження для створення нових відео відповідно до вашого нового плану.",
    pricingDoYouOfferRefunds: "Чи пропонуєте ви повернення коштів?",
    pricingDoYouOfferRefundsAnswer: "Ми пропонуємо 30-денну гарантію повернення коштів для всіх платних планів. Зверніться до нашої служби підтримки, якщо ви не задоволені.",
    pricingCanCancelSubscription: "Чи можу я скасувати свою підписку?",
    pricingCanCancelSubscriptionAnswer: "Так, ви можете скасувати будь-коли з налаштувань свого акаунту. Ваша підписка залишатиметься активною до кінця вашого періоду оплати.",
    pricingCustomEnterpriseSolutions: "Чи пропонуєте ви власні корпоративні рішення?",
    pricingCustomEnterpriseSolutionsAnswer: "Абсолютно! Зв'яжіться з нашою командою продажів, щоб обговорити індивідуальні ціни, функції та інтеграції для вашої організації.",
    pricingGetStarted: "Почніть",
    pricingReadyToCreate: "Готові створити дивовижні AI відео?",
    pricingJoinThousands: "Приєднуйтесь до тисяч творців та бізнесів, які вже використовують нашу платформу для створення професійних AI аватар відео.",
    pricingStartFreeTrial: "Почніть безкоштовний пробний період",
    pricingContactSales: "Зв'яжіться з продажами",
    pricingSavePerYear: "Економте $/рік",
    pricingForever: "назавжди",
    pricingMonth: "місяць",
    pricingYear: "рік",
    
    // Studio Wizard Components
    studioChooseAvatar: "Обрати Аватар",
    studioSelectPresenter: "Обрати Презентера",
    studioLanguageVoice: "Мова та Голос",
    studioPickLanguage: "Обрати Мову",
    studioBackgrounds: "Фони",
    studioChooseScenes: "Обрати Сцени",
    studioScript: "Сценарій",
    studioWriteMessage: "Написати Повідомлення",
    studioGenerate: "Генерувати",
    studioCreateVideo: "Створити Відео",
    studioPreview: "Попередній Перегляд",
    studioReviewDownload: "Переглянути та Завантажити",
    studioStep: "Крок",
    studioOf: "з",
    studioAccessDenied: "Доступ Заборонено",
    studioSignInRequired: "Потрібно увійти для доступу до студії",
    studioSignIn: "Увійти",
    
    // Avatar Step
    studioChooseYourAvatar: "Оберіть свій аватар",
    studioSelectVirtualPresenter: "Оберіть віртуального презентера, який буде доставляти ваше повідомлення.",
    studioEachAvatarUnique: "Кожен аватар має унікальну особистість та стиль мовлення.",
    studioPreview: "Попередній Перегляд",
    studioWillPresentVideo: "буде презентувати ваше відео",
    studioContinue: "Продовжити",
    
    // Language Step
    studioLanguageVoice: "Мова та Голос",
    studioChooseLanguageVoice: "Оберіть мову та голос для вашого відео.",
    studioPreviewEachVoice: "Ви можете прослухати кожен голос перед вибором.",
    studioSelectLanguage: "Обрати Мову",
    studioChooseVoice: "Обрати Голос",
    studioAllTones: "Всі Тони",
    studioProfessional: "Професійний",
    studioEnergetic: "Енергійний",
    studioCalm: "Спокійний",
    studioExpressive: "Виразний",
    studioPlaying: "Відтворення...",
    studioPreview: "Попередній Перегляд",
    studioSelectedVoice: "Обраний Голос",
    studioBack: "Назад",
    studioContinue: "Продовжити",
    
    // Background Step
    studioChooseBackgrounds: "Обрати Фони",
    studioSelectMultipleBackgrounds: "Оберіть кілька фонів для вашого відео.",
    studioChoose2To4Scenes: "Ви можете обрати 2-4 різні сцени для створення динамічних переходів.",
    studioAll: "Всі",
    studioProfessional: "Професійний",
    studioCasual: "Повсякденний",
    studioCreative: "Креативний",
    studioBackgroundsSelected: "фонів обрано",
    studioPreview: "Попередній Перегляд",
    studioPreviewMode: "Режим Попереднього Перегляду",
    studioExitPreview: "Вийти з Попереднього Перегляду",
    studioSelectedBackgrounds: "Обрані Фони",
    studioMoreBackgrounds: "більше фонів",
    studioBack: "Назад",
    studioContinue: "Продовжити",
    
    // Text Step
    studioWriteYourScript: "Напишіть свій сценарій",
    studioWriteTextAvatarSpeak: "Напишіть текст, який буде говорити ваш аватар.",
    studioStartWithTemplate: "Ви можете почати з шаблону або написати власний контент.",
    studioQuickTemplates: "Швидкі Шаблони",
    studioWelcomeMessage: "Привітальне Повідомлення",
    studioProductIntroduction: "Презентація Продукту",
    studioTrainingIntroduction: "Вступ до Навчання",
    studioCompanyAnnouncement: "Оголошення Компанії",
    studioTutorialIntroduction: "Вступ до Туторіалу",
    studioSpecialOffer: "Спеціальна Пропозиція",
    studioBusiness: "Бізнес",
    studioMarketing: "Маркетинг",
    studioEducation: "Освіта",
    studioYourScript: "Ваш Сценарій",
    studioWords: "слів",
    studioCharacters: "символів",
    studioDuration: "тривалість",
    studioShort: "Короткий",
    studioMedium: "Середній",
    studioLong: "Довгий",
    studioWriteScriptHere: "Напишіть свій сценарій тут... Ваш аватар буде говорити цей текст природно.",
    studioWritingTips: "Поради з Написання",
    studioNaturalSpeech: "Природна Мова",
    studioWriteAsYouSpeak: "Пишіть так, як ви говорите природно, з паузами та наголосами.",
    studioOptimalLength: "Оптимальна Довжина",
    studioKeepVideos30To120: "Тримайте відео між 30-120 секундами для найкращого залучення.",
    studioClearStructure: "Чітка Структура",
    studioStartWithHook: "Почніть з гачка, доставте ваше повідомлення та закінчіть закликом до дії.",
    studioPronunciation: "Вимова",
    studioUsePhoneticSpelling: "Використовуйте фонетичне написання для складних слів: \"AI\" як \"А-І\".",
    studioPreview: "Попередній Перегляд",
    studioBack: "Назад",
    studioContinue: "Продовжити",
    
    // Generation Step
    studioGenerateYourVideo: "Згенерувати Ваше Відео",
    studioCreatePersonalizedVideo: "Ми створимо ваше персоналізоване відео за допомогою AI.",
    studioProcessTakes2To3Minutes: "Цей процес зазвичай займає 2-3 хвилини.",
    studioVideoSummary: "Резюме Відео",
    studioAvatar: "Аватар",
    studioBackground: "Фон",
    studioDuration: "Тривалість",
    studioWords: "слів",
    studioGeneratingYourVideo: "Генерування Вашого Відео",
    studioDontCloseWindow: "Будь ласка, не закривайте це вікно, поки ми створюємо ваше відео.",
    studioProgress: "Прогрес",
    studioPreparingAssets: "Підготовка ресурсів",
    studioGeneratingAvatarAnimation: "Генерування анімації аватара",
    studioSynthesizingVoice: "Синтез голосу",
    studioProcessingBackground: "Обробка фону",
    studioCompositingVideo: "Композиція відео",
    studioFinalizingOutput: "Завершення виводу",
    studioComplete: "Завершено",
    studioProcessing: "Обробка...",
    studioEstimatedTimeRemaining: "Орієнтовний час, що залишився:",
    studioCancelGeneration: "Скасувати Генерування",
    studioReadyToGenerate: "Готово до Генерування",
    studioVideoCreatedWithSettings: "Ваше відео буде створено з налаштуваннями вище.",
    studioStartGeneration: "Почати Генерування",
    studioBack: "Назад",
    studioGenerationTakes2To3Minutes: "Генерування зазвичай займає 2-3 хвилини",
    
    // Preview Step
    studioYourVideoReady: "Ваше Відео Готове!",
    studioReviewGeneratedVideo: "Перегляньте ваше згенероване відео та завантажте його, коли будете задоволені результатом.",
    studioDownloadWhenSatisfied: "Завантажте його, коли будете задоволені результатом.",
    studioPlaying: "Відтворення...",
    studioClickToPreview: "Натисніть для попереднього перегляду",
    studioDuration: "Тривалість",
    studioQuality: "Якість",
    studioFormat: "Формат",
    studioFileSize: "Розмір Файлу",
    studioVideoSettings: "Налаштування Відео",
    studioVoice: "Голос",
    studioBackground: "Фон",
    studioResolution: "Роздільна Здатність",
    studioScriptLength: "Довжина Сценарію",
    studioScript: "Сценарій",
    studioActions: "Дії",
    studioDownloading: "Завантаження...",
    studioDownloadVideo: "Завантажити Відео",
    studioRegenerate: "Перегенерувати",
    studioSaveContinue: "Зберегти та Продовжити",
    studioDownloadProgress: "Прогрес Завантаження",
    studioBack: "Назад",
    studioVideoGeneratedSuccessfully: "Відео успішно згенеровано",
    
    // About Page
    aboutTitle: "Про MarketUp",
    aboutWelcome: "Ласкаво просимо до MarketUp, європейської платформи, створеної для допомоги всім — від власників невеликих магазинів і кафе до великих компаній — просувати свій бізнес",
    aboutEasilyAffordably: "легко та доступно.",
    aboutEuropeanPlatform: "Європейська платформа",
    aboutForEveryone: "Для всіх",
    aboutEasyAffordable: "Легко та доступно",
    aboutOurMissionVision: "Наша Місія та Бачення",
    aboutDrivingInnovation: "Рухаємо інновації в маркетингових технологіях для",
    aboutEveryone: "всіх",
    aboutOurMission: "Наша Місія",
    aboutMissionText: "Наша місія — надати можливості приватним особам та бізнесу просувати свої продукти або послуги без необхідності дорогих рекламних агентств — просто простий, розумний та ефективний маркетинг.",
    aboutOurVision: "Наше Бачення",
    aboutVisionText: "Наше бачення майбутнього — розширювати MarketUp новими та інноваційними способами, які роблять маркетинг ще простішим та потужнішим для всіх користувачів.",
    aboutWhatMakesDifferent: "Що Робить Нас Особливими",
    aboutDifferentText: "Що робить нас особливими — це наш фокус на",
    aboutSimplicityQualityAccessibility: "простоті, якості та доступності.",
    aboutWhatMarketUpOffers: "Що Пропонує MarketUp",
    aboutComprehensiveSolutions: "Комплексні рішення для всіх ваших",
    aboutMarketingNeeds: "маркетингових потреб",
    aboutSmartAIVideo: "Розумне створення відео на основі ШІ",
    aboutForMarketing: "для маркетингу",
    aboutAffordablePricing: "Доступні тарифні плани",
    aboutSuitableForAll: "підходящі для всіх користувачів",
    aboutMultilingualSupport: "Команда підтримки багатьма мовами",
    aboutLanguages: "Англійська, Арабська, Шведська та Турецька",
    aboutEasyToUse: "Прості в використанні інструменти",
    aboutMakeVideoMarketing: "які роблять відеомаркетинг швидшим, більш креативним та доступним для всіх",
    aboutActive: "Активно",
    aboutOurCommitment: "Наші Зобов'язання",
    aboutCommitmentText: "Ми прагнемо надавати постійну підтримку, розумніші інструменти та креативні рішення для забезпечення найкращого досвіду для кожного клієнта.",
    aboutQuote: "MarketUp – де ваші ідеї стають маркетинговою силою",
    aboutOurSlogans: "Наші Слогани",
    aboutSlogan: "Слоган",
    aboutSloganText: "MarketUp – ваш бізнес заслуговує на те, щоб його побачили",
    aboutTagline: "Слоган",
    aboutTaglineText: "Ваша історія, наша технологія – одне бачення успіху",
    aboutReadyToTransform: "Готові перетворити ваш",
    aboutMarketing: "маркетинг?",
    aboutJoinThousands: "Приєднуйтесь до тисяч бізнесів, які вже використовують MarketUp для створення професійних маркетингових відео.",
    aboutGetStarted: "Розпочати",
    aboutSeePricing: "Подивитися ціни",
    
    // Dashboard Page
    dashboardWelcomeBack: "Ласкаво просимо назад,",
    dashboardCreator: "Творче!",
    dashboardTotalVideos: "Всього відео",
    dashboardThisMonth: "цього місяця",
    dashboardCurrentPlan: "Поточний план",
    dashboardFreePlan: "Безкоштовний план",
    dashboardUpgradeToPro: "Оновити до Pro",
    dashboardStorageUsed: "Використано сховища",
    dashboardOfUsed: "з",
    dashboardCompleted: "Завершено",
    dashboardReadyToView: "Готово до перегляду",
    dashboardProcessing: "Обробляється",
    dashboardInProgress: "В процесі",
    dashboardTotalViews: "Всього переглядів",
    dashboardAllTime: "За весь час",
    dashboardDownloads: "Завантажень",
    dashboardQuickActions: "Швидкі дії",
    dashboardCreateVideo: "Створити відео",
    dashboardStartNewProject: "Розпочати новий відеопроект",
    dashboardMyVideos: "Мої відео",
    dashboardViewAllVideos: "Переглянути всі ваші відео",
    dashboardUpgradePlan: "Оновити план",
    dashboardManageSubscription: "Керувати підпискою",
    dashboardSettings: "Налаштування",
    dashboardAccountPreferences: "Налаштування акаунту",
    dashboardRecentVideos: "Останні відео",
    dashboardViewAll: "Переглянути всі →",
    dashboardViews: "переглядів",
    dashboardNoVideosYet: "Поки немає відео",
    dashboardCreateFirstVideo: "Створіть своє перше відео, щоб розпочати",
    
    // Profile Page
    profileAnonymousUser: "Анонімний користувач",
    profileNotSet: "Не встановлено",
    profileCancel: "Скасувати",
    profileEditProfile: "Редагувати профіль",
    profilePersonalInformation: "Особиста інформація",
    profileFullName: "Повне ім'я",
    profileEnterFullName: "Введіть ваше повне ім'я",
    profileEmailAddress: "Адреса електронної пошти",
    profileEnterEmail: "Введіть вашу електронну пошту",
    profileEmailCannotBeChanged: "Електронну пошту не можна змінити",
    profileBio: "Біографія",
    profileTellAboutYourself: "Розкажіть про себе...",
    profileCountry: "Країна",
    profileSelectCountry: "Оберіть вашу країну",
    profileLanguage: "Мова",
    profileSelectLanguage: "Оберіть вашу мову",
    profileCompany: "Компанія",
    profileCompanyName: "Назва вашої компанії",
    profileWebsite: "Веб-сайт",
    profileWebsiteUrl: "https://вашсайт.com",
    profileSaving: "Збереження...",
    profileSaveChanges: "Зберегти зміни",
    profileProfileStats: "Статистика профілю",
    profileProfileCompletion: "Заповненість профілю",
    profileVideos: "Відео",
    profileProjects: "Проекти",
    profileAccountSettings: "Налаштування акаунту",
    profileChangePassword: "Змінити пароль",
    profileUpdatePassword: "Оновити ваш пароль",
    profileTwoFactorAuth: "Двофакторна автентифікація",
    profileAddExtraSecurity: "Додати додаткову безпеку",
    profileDeleteAccount: "Видалити акаунт",
    profilePermanentlyDeleteAccount: "Назавжди видалити акаунт",
    
    // Videos Page
    videosMyVideos: "Мої відео",
    videosManageViewAll: "Керуйте та переглядайте всі ваші створені відео",
    videosCreateNewVideo: "Створити нове відео",
    videosSearchVideos: "Пошук відео...",
    videosAll: "Всі",
    videosCompleted: "Завершено",
    videosProcessing: "Обробляється",
    videosQueued: "В черзі",
    videosLoadingVideos: "Завантаження відео...",
    videosStatus: "Статус",
    videosDuration: "Тривалість",
    videosViews: "Перегляди",
    videosDownloads: "Завантаження",
    videosView: "Переглянути",
    videosEdit: "Редагувати",
    videosDownload: "Завантажити",
    videosShare: "Поділитися",
    videosDuplicate: "Дублювати",
    videosDelete: "Видалити",
    videosProcessingStatus: "Обробляється...",
    videosNoVideosFound: "Відео не знайдено",
    videosTryAdjustingSearch: "Спробуйте змінити пошукові терміни",
    videosCreateFirstVideo: "Створіть своє перше відео, щоб розпочати",
    videosCreateVideo: "Створити відео",
    videosPage: "Сторінка",
    videosOf: "з",
    videosPrevious: "Попередня",
    videosPrev: "Попер",
    videosNext: "Наступна",
    videosDownloadFunctionalityComingSoon: "Функціональність завантаження незабаром!",
    videosShareFunctionalityComingSoon: "Функціональність поширення незабаром!",
    videosDeleteFunctionalityComingSoon: "Функціональність видалення незабаром!",
    videosDuplicateFunctionalityComingSoon: "Функціональність дублювання незабаром!",
    videosAreYouSureDelete: "Ви впевнені, що хочете видалити це відео?",
    
    // Subscription Page
    subscriptionManagement: "Управління підпискою",
    subscriptionManageBillingUpgrade: "Керуйте своєю підпискою, оплатою та оновлюйте план для розблокування більше функцій",
    subscriptionCurrentPlan: "Поточний план",
    subscriptionManageSubscriptionBilling: "Керуйте своєю підпискою та оплатою",
    subscriptionCancelling: "Скасовується",
    subscriptionEnds: "Закінчується",
    subscriptionNextBilling: "Наступна оплата",
    subscriptionUsageThisMonth: "Використання цього місяця",
    subscriptionVideosCreated: "Відео створено",
    subscriptionUsed: "використано",
    subscriptionChangePlan: "Змінити план",
    subscriptionUpdatePayment: "Оновити оплату",
    subscriptionCancelSubscription: "Скасувати підписку",
    subscriptionReactivate: "Повторно активувати",
    subscriptionUpgradePlan: "Оновити план",
    subscriptionAvailablePlans: "Доступні плани",
    subscriptionChoosePlanBestFits: "Оберіть план, який найкраще підходить вашим потребам і розблокуйте більше функцій",
    subscriptionMostPopular: "Найпопулярніший",
    subscriptionChoosePlan: "Обрати план",
    subscriptionBillingHistory: "Історія оплат",
    subscriptionTrackPaymentHistory: "Відстежуйте історію платежів та завантажуйте рахунки",
    subscriptionDownload: "Завантажити",
    subscriptionNoBillingHistory: "Немає історії оплат",
    subscriptionBillingHistoryWillAppear: "Ваша історія оплат з'явиться тут",
    subscriptionErrorLoadingData: "Помилка завантаження даних підписки",
    subscriptionPleaseTryRefreshing: "Спробуйте оновити сторінку",
    subscriptionRefreshPage: "Оновити сторінку",
    subscriptionChangePlanFunctionalityComingSoon: "Функціональність зміни плану незабаром!",
    subscriptionUpdatePaymentFunctionalityComingSoon: "Функціональність оновлення оплати незабаром!",
    subscriptionCancelSubscriptionFunctionalityComingSoon: "Функціональність скасування підписки незабаром!",
    subscriptionUpgradePlanFunctionalityComingSoon: "Функціональність оновлення плану незабаром!",
    subscriptionDownloadInvoiceFunctionalityComingSoon: "Функціональність завантаження рахунку незабаром!",
    subscriptionUpgradeToPlanFunctionalityComingSoon: "Оновлення до {plan} плану функціональність незабаром!",
    
    // Billing Page
    billingInvoices: "Оплата та рахунки",
    billingManageBillingInformation: "Керуйте своєю платіжною інформацією, методами оплати та відстежуйте використання",
    billingOverview: "Огляд",
    billingPaymentMethods: "Методи оплати",
    billingUsage: "Використання",
    billingErrorLoadingData: "Помилка завантаження даних оплати",
    billingPleaseTryRefreshing: "Спробуйте оновити сторінку",
    billingRefreshPage: "Оновити сторінку",
    billingCurrentBillingPeriod: "Поточний період оплати",
    billingPeriod: "Період",
    billingCurrentBillingCycle: "Поточний цикл оплати",
    billingAmount: "Сума",
    billingStatus: "Статус",
    billingFreePlan: "Безкоштовний план",
    billingAutoRenewalEnabled: "Автоматичне продовження увімкнено",
    billingUsageThisMonth: "Використання цього місяця",
    billingVideosCreated: "Відео створено",
    billingOf: "з",
    billingStorageUsed: "Використано сховища",
    billingBandwidth: "Пропускна здатність",
    billingThisMonth: "цього місяця",
    billingInvoiceHistory: "Історія рахунків",
    billingNoInvoicesYet: "Рахунків ще немає",
    billingInvoiceHistoryWillAppear: "Ваша історія рахунків з'явиться тут",
    billingDownload: "Завантажити",
    billingAddPaymentMethod: "Додати метод оплати",
    billingDefault: "За замовчуванням",
    billingEdit: "Редагувати",
    billingNoPaymentMethod: "Немає методу оплати",
    billingAddPaymentMethodToManage: "Додайте метод оплати для керування підпискою",
    billingDetailedUsage: "Детальне використання",
    billingBandwidthThisMonth: "Пропускна здатність цього місяця",
    billingUnlimited: "Необмежено",
    
    // Settings Page
    settingsTitle: "Налаштування",
    settingsManageAccountPreferences: "Керуйте налаштуваннями облікового запису, сповіщеннями та безпекою",
    settingsMemberSince: "Учасник з",
    settingsSaving: "Збереження...",
    settingsSaveChanges: "Зберегти зміни",
    settingsAccountInformation: "Інформація облікового запису",
    settingsEmail: "Електронна пошта",
    settingsName: "Ім'я",
    settingsCountry: "Країна",
    settingsSelectCountry: "Оберіть країну",
    settingsNotifications: "Сповіщення",
    settingsEmailNotifications: "Сповіщення електронною поштою",
    settingsReceiveNotificationsViaEmail: "Отримувати сповіщення електронною поштою",
    settingsPushNotifications: "Push-сповіщення",
    settingsReceivePushNotificationsInBrowser: "Отримувати push-сповіщення у браузері",
    settingsMarketingEmails: "Маркетингові листи",
    settingsReceiveUpdatesAboutNewFeatures: "Отримувати оновлення про нові функції та поради",
    settingsProductUpdates: "Оновлення продукту",
    settingsGetNotifiedAboutNewFeatures: "Отримувати сповіщення про нові функції та покращення",
    settingsPrivacySecurity: "Конфіденційність та безпека",
    settingsProfileVisibility: "Видимість профілю",
    settingsControlWhoCanSeeProfile: "Контролюйте, хто може бачити інформацію вашого профілю",
    settingsPublic: "Публічний",
    settingsPrivate: "Приватний",
    settingsFriendsOnly: "Тільки друзі",
    settingsAnalytics: "Аналітика",
    settingsHelpUsImproveBySharing: "Допоможіть нам покращити, поділившись анонімними даними використання",
    settingsDataSharing: "Обмін даними",
    settingsAllowSharingDataWithPartners: "Дозволити обмін даними з партнерами третьої сторони",
    settingsPreferences: "Налаштування",
    settingsTheme: "Тема",
    settingsDark: "Темна",
    settingsLight: "Світла",
    settingsAuto: "Автоматично",
    settingsLanguage: "Мова",
    settingsEnglish: "English",
    settingsUkrainian: "Українська",
    settingsSpanish: "Español",
    settingsFrench: "Français",
    settingsTimezone: "Часовий пояс",
    settingsUTC: "UTC",
    settingsEasternTime: "Східний час",
    settingsPacificTime: "Тихоокеанський час",
    settingsLondon: "Лондон",
    settingsKiev: "Київ",
    settingsDateFormat: "Формат дати",
    settingsMMDDYYYY: "MM/DD/YYYY",
    settingsDDMMYYYY: "DD/MM/YYYY",
    settingsYYYYMMDD: "YYYY-MM-DD",
    settingsDangerZone: "Небезпечна зона",
    settingsExportData: "Експорт даних",
    settingsDownloadCopyOfData: "Завантажити копію ваших даних",
    settingsExport: "Експорт",
    settingsDeleteAccount: "Видалити обліковий запис",
    settingsPermanentlyDeleteAccount: "Назавжди видалити ваш обліковий запис та всі дані",
    settingsSettingsSavedSuccessfully: "Налаштування успішно збережено!",
    settingsErrorSavingSettings: "Помилка збереження налаштувань. Спробуйте ще раз.",
    settingsDataExportFeatureComingSoon: "Функція експорту даних незабаром!",
    settingsAccountDeletionFeatureComingSoon: "Функція видалення облікового запису незабаром!",
    settingsAreYouSureDeleteAccount: "Ви впевнені, що хочете видалити свій обліковий запис? Цю дію неможливо скасувати.",
    
    // Remember Me Settings
    rememberMeSettings: "Налаштування \"Запам'ятати мене\"",
    rememberMeDescription: "\"Запам'ятати мене\" дозволяє залишатися увійшовшим до 30 днів на довірених пристроях. Якщо ви використовуєте спільний або публічний комп'ютер, ми рекомендуємо не використовувати цю функцію.",
    rememberMeClearSessions: "Очистити сесії \"Запам'ятати мене\"",
    rememberMeClearSessionsDescription: "Це виведе вас з усіх пристроїв, де ви обрали бути запам'ятованим.",
    rememberMeClearing: "Очищення...",
    rememberMeClearAllSessions: "Очистити всі сесії",
    rememberMeSessionsClearedSuccessfully: "Сесії \"Запам'ятати мене\" успішно очищено",
    rememberMeFailedToClearSessions: "Не вдалося очистити сесії \"Запам'ятати мене\"",
    rememberMeErrorOccurred: "Сталася помилка при очищенні сесій",
    
    // Dashboard Sidebar
    dashboardSidebarTitle: "Панель керування",
    dashboardSidebarWelcomeBack: "Ласкаво просимо назад",
    dashboardSidebarOverview: "Огляд",
    dashboardSidebarProfile: "Профіль",
    dashboardSidebarVideos: "Відео",
    dashboardSidebarSubscription: "Підписка",
    dashboardSidebarBilling: "Рахунки",
    dashboardSidebarSettings: "Налаштування",
    dashboardSidebarAccount: "Обліковий запис",
    dashboardSidebarSignOut: "Вийти",
    dashboardSidebarManageAccount: "Керуйте своїм обліковим записом та налаштуваннями",
    
    // Admin Panel
    adminOverview: "Огляд метрик та аналітики вашої платформи",
    adminOverviewDescription: "Огляд метрик та аналітики вашої платформи",
    adminExportReport: "Експорт звіту",
    adminRefreshing: "Оновлення...",
    adminRefreshData: "Оновити дані",
    adminTotalUsers: "Загальна кількість користувачів",
    adminTotalRevenue: "Загальний дохід",
    adminVideosCreated: "Створені відео",
    adminActiveUsers: "Активні користувачі",
    adminRevenueTrend: "Тенденція доходів",
    adminRevenue: "Дохід",
    adminUserActivity: "Активність користувачів",
    adminActiveUsers: "Активні користувачі",
    adminChartVisualizationComingSoon: "Візуалізація діаграм незабаром",
    adminRecentActivity: "Остання активність",
    adminNoRecentActivity: "Немає останньої активності",
    adminActivityWillAppearHere: "Активність з'явиться тут, коли користувачі взаємодіють з платформою",
    adminErrorLoadingData: "Помилка завантаження даних адміністратора",
    adminTryAgain: "Спробувати ще раз",
    adminNetworkErrorOccurred: "Сталася помилка мережі",
    
    // Admin Users Management
    adminUsersManagement: "Управління користувачами",
    adminUsersManagementDescription: "Керуйте користувачами платформи, їх обліковими записами та дозволами",
    adminAddUser: "Додати користувача",
    adminSearchFilters: "Пошук та фільтри",
    adminSearchUsers: "Пошук користувачів...",
    adminAllStatus: "Всі статуси",
    adminActive: "Активний",
    adminInactive: "Неактивний",
    adminSuspended: "Заблокований",
    adminAllSubscriptions: "Всі підписки",
    adminFree: "Безкоштовно",
    adminBasic: "Базовий",
    adminPremium: "Преміум",
    adminEnterprise: "Корпоративний",
    adminSortByJoinDate: "Сортувати за датою приєднання",
    adminSortByName: "Сортувати за ім'ям",
    adminSortByEmail: "Сортувати за електронною поштою",
    adminSortByLastActive: "Сортувати за останньою активністю",
    adminSortByVideos: "Сортувати за відео",
    adminSortByTotalSpent: "Сортувати за загальними витратами",
    adminUsersSelected: "користувачів вибрано",
    adminUserSelected: "користувач вибрано",
    adminActivate: "Активувати",
    adminSuspend: "Заблокувати",
    adminDelete: "Видалити",
    adminClear: "Очистити",
    adminUser: "Користувач",
    adminStatus: "Статус",
    adminSubscription: "Підписка",
    adminVideos: "Відео",
    adminTotalSpent: "Загальні витрати",
    adminLastActive: "Остання активність",
    adminActions: "Дії",
    adminShowingUsers: "Показано",
    adminOfUsers: "з",
    adminPrevious: "Попередня",
    adminNext: "Наступна",
    adminEditUser: "Редагувати користувача",
    adminName: "Ім'я",
    adminEmail: "Електронна пошта",
    adminRole: "Роль",
    adminUserRole: "Користувач",
    adminAdminRole: "Адміністратор",
    adminModeratorRole: "Модератор",
    adminSaveChanges: "Зберегти зміни",
    adminCancel: "Скасувати",
    adminUserUpdatedSuccessfully: "Користувача успішно оновлено!",
    adminFailedToUpdateUser: "Не вдалося оновити користувача:",
    adminErrorUpdatingUser: "Помилка оновлення користувача",
    adminAreYouSureDeleteUsers: "Ви впевнені, що хочете видалити",
    adminUsersDeletedSuccessfully: "користувачів успішно видалено!",
    adminFailedToDeleteUsers: "Не вдалося видалити користувачів:",
    adminErrorPerformingAction: "Помилка виконання",
    adminActionComingSoon: "дії для",
    
    // Admin Videos Management
    adminVideosModeration: "Модерація Відео",
    adminVideosModerationDescription: "Переглядайте та модерируйте відеоконтент, завантажений користувачами",
    adminVideosToReview: "відео для перегляду",
    adminVideosSearchFilters: "Пошук та Фільтри",
    adminVideosSearch: "Пошук",
    adminVideosSearchPlaceholder: "Пошук відео або завантажувачів...",
    adminVideosStatus: "Статус",
    adminVideosAllStatus: "Всі Статуси",
    adminVideosPending: "Очікує",
    adminVideosApproved: "Схвалено",
    adminVideosRejected: "Відхилено",
    adminVideosSortBy: "Сортувати за",
    adminVideosUploadDate: "Дата завантаження",
    adminVideosTitle: "Назва",
    adminVideosUploader: "Завантажувач",
    adminVideosFlags: "Прапорці",
    adminVideosOrder: "Порядок",
    adminVideosNewestFirst: "Спочатку нові",
    adminVideosOldestFirst: "Спочатку старі",
    adminVideosReview: "Переглянути",
    adminVideosReason: "Причина",
    adminVideosViews: "переглядів",
    adminVideosLikes: "вподобань",
    adminVideosFlagsCount: "прапорців",
    adminVideosReviewVideo: "Переглянути Відео",
    adminVideosVideoInformation: "Інформація про Відео",
    adminVideosDuration: "Тривалість",
    adminVideosCategory: "Категорія",
    adminVideosUploadDate: "Дата завантаження",
    adminVideosFlagsCount: "Прапорці",
    adminVideosUploaderInformation: "Інформація про Завантажувача",
    adminVideosDescription: "Опис",
    adminVideosTags: "Теги",
    adminVideosReject: "Відхилити",
    adminVideosApprove: "Схвалити",
    adminVideosEnterRejectionReason: "Введіть причину відхилення:",
    adminVideosVideoPlayer: "Відеоплеєр",
    adminVideosClickToPlay: "Натисніть для відтворення",
    
    // Admin Scheduler Management
    adminSchedulerPublicationScheduler: "Планувальник Публікацій",
    adminSchedulerScheduleVideoPublications: "Плануйте публікації відео в соціальних мережах",
    adminSchedulerScheduleNewPost: "+ Запланувати Новий Пост",
    adminSchedulerSearchFilters: "Пошук та Фільтри",
    adminSchedulerStatusFilter: "Фільтр Статусу",
    adminSchedulerAllStatus: "Всі Статуси",
    adminSchedulerScheduled: "Заплановано",
    adminSchedulerPublished: "Опубліковано",
    adminSchedulerFailed: "Не вдалося",
    adminSchedulerCancelled: "Скасовано",
    adminSchedulerSocialNetwork: "Соціальна Мережа",
    adminSchedulerAllNetworks: "Всі Мережі",
    adminSchedulerDuration: "Тривалість",
    adminSchedulerCategory: "Категорія",
    adminSchedulerPublishesIn: "Опублікується через",
    adminSchedulerPublishNow: "Опублікувати Зараз",
    adminSchedulerCancel: "Скасувати",
    adminSchedulerScheduleNewPost: "Запланувати Новий Пост",
    adminSchedulerSelectVideo: "Оберіть Відео *",
    adminSchedulerSelectSocialNetworks: "Оберіть Соціальні Мережі *",
    adminSchedulerPublicationDate: "Дата Публікації *",
    adminSchedulerPublicationTime: "Час Публікації *",
    adminSchedulerCustomMessage: "Персональне Повідомлення",
    adminSchedulerCustomMessageOptional: "Персональне Повідомлення (Необов'язково)",
    adminSchedulerCustomMessagePlaceholder: "Додайте персональне повідомлення до вашого відео...",
    adminSchedulerCancel: "Скасувати",
    adminSchedulerSchedulePost: "Запланувати Пост",
    adminSchedulerScheduling: "Планування...",
    adminSchedulerPleaseSelectVideo: "Будь ласка, оберіть відео",
    adminSchedulerPleaseSelectNetwork: "Будь ласка, оберіть принаймні одну соціальну мережу",
    adminSchedulerPleaseSelectDate: "Будь ласка, оберіть дату публікації",
    adminSchedulerPleaseSelectTime: "Будь ласка, оберіть час публікації",
    adminSchedulerPostScheduledSuccessfully: "Пост успішно заплановано!",
    adminSchedulerFailedToSchedulePost: "Не вдалося запланувати пост. Спробуйте ще раз.",
    adminSchedulerErrorSchedulingPost: "Помилка при плануванні поста. Спробуйте ще раз.",
    adminSchedulerFailedToCancelPost: "Не вдалося скасувати пост. Спробуйте ще раз.",
    adminSchedulerErrorCancellingPost: "Помилка при скасуванні поста. Спробуйте ще раз.",
    adminSchedulerFailedToPublishPost: "Не вдалося опублікувати пост. Спробуйте ще раз.",
    adminSchedulerErrorPublishingPost: "Помилка при публікації поста. Спробуйте ще раз.",
    adminSchedulerOverdue: "Прострочено",
    
    // Admin Payments Management
    adminPaymentsPaymentManagement: "Управління Платежами",
    adminPaymentsViewManageTransactions: "Переглядайте та керуйте платіжними транзакціями",
    adminPaymentsTransactions: "транзакцій",
    adminPaymentsSearchFilters: "Пошук та Фільтри",
    adminPaymentsSearch: "Пошук",
    adminPaymentsSearchPlaceholder: "Пошук транзакцій...",
    adminPaymentsStatus: "Статус",
    adminPaymentsAllStatus: "Всі Статуси",
    adminPaymentsPending: "В очікуванні",
    adminPaymentsCompleted: "Завершено",
    adminPaymentsFailed: "Не вдалося",
    adminPaymentsRefunded: "Повернуто",
    adminPaymentsCancelled: "Скасовано",
    adminPaymentsType: "Тип",
    adminPaymentsAllTypes: "Всі Типи",
    adminPaymentsSubscription: "Підписка",
    adminPaymentsOneTime: "Одноразовий",
    adminPaymentsRefund: "Повернення",
    adminPaymentsUpgrade: "Оновлення",
    adminPaymentsDateRange: "Діапазон Дат",
    adminPaymentsAllTime: "Весь Час",
    adminPaymentsToday: "Сьогодні",
    adminPaymentsThisWeek: "Цей Тиждень",
    adminPaymentsThisMonth: "Цей Місяць",
    adminPaymentsThisYear: "Цей Рік",
    adminPaymentsTotalRevenue: "Загальний Доход",
    adminPaymentsCompleted: "Завершено",
    adminPaymentsPending: "В очікуванні",
    adminPaymentsFailed: "Не вдалося",
    adminPaymentsInvoice: "Рахунок",
    adminPaymentsConfirm: "Підтвердити",
    adminPaymentsCancel: "Скасувати",
    adminPaymentsRefund: "Повернення",
    adminPaymentsView: "Переглянути",
    adminPaymentsTransactionDetails: "Деталі Транзакції",
    adminPaymentsTransactionInformation: "Інформація про Транзакцію",
    adminPaymentsUserInformation: "Інформація про Користувача",
    adminPaymentsAdditionalInformation: "Додаткова Інформація",
    adminPaymentsPlan: "План",
    adminPaymentsBilling: "Виставлення Рахунків",
    adminPaymentsDiscount: "Знижка",
    adminPaymentsTax: "Податок",
    adminPaymentsCancelPayment: "Скасувати Платіж",
    adminPaymentsRefund: "Повернення",
    adminPaymentsConfirmPayment: "Підтвердити Платіж",
    adminPaymentsEnterCancellationReason: "Введіть причину скасування:",
    adminPaymentsEnterRefundReason: "Введіть причину повернення:",
    adminPaymentsFailedToConfirmPayment: "Не вдалося підтвердити платіж. Спробуйте ще раз.",
    adminPaymentsErrorConfirmingPayment: "Помилка при підтвердженні платежу. Спробуйте ще раз.",
    adminPaymentsRefundFunctionalityWouldBeImplemented: "Функціональність повернення буде реалізована тут",
    adminPaymentsErrorProcessingRefund: "Помилка при обробці повернення. Спробуйте ще раз.",
    adminPaymentsFailedToCancelPayment: "Не вдалося скасувати платіж. Спробуйте ще раз.",
    adminPaymentsErrorCancellingPayment: "Помилка при скасуванні платежу. Спробуйте ще раз.",
    
    // Admin Tickets Management
    adminTicketsSupportTickets: "Тікети Підтримки",
    adminTicketsManageCustomerSupport: "Керуйте тікетами підтримки клієнтів для преміум клієнтів",
    adminTicketsTickets: "тікетів",
    adminTicketsSearchFilters: "Пошук та Фільтри",
    adminTicketsSearch: "Пошук",
    adminTicketsSearchPlaceholder: "Пошук тікетів...",
    adminTicketsStatus: "Статус",
    adminTicketsAllStatus: "Всі Статуси",
    adminTicketsOpen: "Відкритий",
    adminTicketsInProgress: "В Роботі",
    adminTicketsResolved: "Вирішено",
    adminTicketsClosed: "Закритий",
    adminTicketsPriority: "Пріоритет",
    adminTicketsAllPriority: "Всі Пріоритети",
    adminTicketsUrgent: "Терміновий",
    adminTicketsHigh: "Високий",
    adminTicketsMedium: "Середній",
    adminTicketsLow: "Низький",
    adminTicketsCategory: "Категорія",
    adminTicketsAllCategories: "Всі Категорії",
    adminTicketsTechnical: "Технічний",
    adminTicketsBilling: "Оплата",
    adminTicketsFeatureRequest: "Запит Функції",
    adminTicketsBugReport: "Звіт про Помилку",
    adminTicketsGeneral: "Загальний",
    adminTicketsSubscription: "Підписка",
    adminTicketsAllSubscriptions: "Всі Підписки",
    adminTicketsPremium: "Преміум",
    adminTicketsEnterprise: "Підприємство",
    adminTicketsTotalTickets: "Всього Тікетів",
    adminTicketsOpen: "Відкритий",
    adminTicketsInProgress: "В Роботі",
    adminTicketsResolved: "Вирішено",
    adminTicketsUrgent: "Терміновий",
    adminTicketsView: "Переглянути",
    adminTicketsAssignedTo: "Призначено",
    adminTicketsMessages: "повідомлень",
    adminTicketsTicketInformation: "Інформація про Тікет",
    adminTicketsUserInformation: "Інформація про Користувача",
    adminTicketsDescription: "Опис",
    adminTicketsConversation: "Розмова",
    adminTicketsAssignToMe: "Призначити Мені",
    adminTicketsTypeYourResponse: "Введіть вашу відповідь...",
    adminTicketsSend: "Надіслати",
    adminTicketsFailedToSendMessage: "Не вдалося надіслати повідомлення. Спробуйте ще раз.",
    adminTicketsErrorSendingMessage: "Помилка при надсиланні повідомлення. Спробуйте ще раз.",
    adminTicketsFailedToUpdateStatus: "Не вдалося оновити статус. Спробуйте ще раз.",
    adminTicketsErrorUpdatingStatus: "Помилка при оновленні статусу. Спробуйте ще раз.",
    adminTicketsFailedToAssignTicket: "Не вдалося призначити тікет. Спробуйте ще раз.",
    adminTicketsErrorAssigningTicket: "Помилка при призначенні тікету. Спробуйте ще раз.",
    adminTicketsJustNow: "Щойно",
    adminTicketsHoursAgo: "год тому",
    adminTicketsDaysAgo: "дн тому",

    // Admin Sidebar
    adminSidebarDashboard: "Панель керування",
    adminSidebarUsers: "Користувачі",
    adminSidebarVideoModeration: "Модерація відео",
    adminSidebarPublicationScheduler: "Планувальник публікацій",
    adminSidebarPaymentManagement: "Управління платежами",
    adminSidebarTicketSystem: "Система тікетів",
    adminSidebarAdminPanel: "Адмін панель",
    adminSidebarManagePlatform: "Керуйте своєю платформою та аналітикою",
    adminSidebarSignOut: "Вийти",

    // Admin Header
    adminHeaderDashboard: "Панель керування",
    adminHeaderUsers: "Користувачі",
    adminHeaderVideoModeration: "Модерація відео",
    adminHeaderPublicationScheduler: "Планувальник публікацій",
    adminHeaderPaymentManagement: "Управління платежами",
    adminHeaderTicketSystem: "Система тікетів",
    adminHeaderAdminPanel: "Адмін панель",
    adminHeaderManagePlatform: "Керуйте своєю платформою та аналітикою",
    adminHeaderSearch: "Пошук",
    adminHeaderSearchPlaceholder: "Пошук...",
    adminHeaderNotifications: "Сповіщення",
    adminHeaderNewUserRegistered: "Новий користувач зареєстрований",
    adminHeaderVideoProcessingCompleted: "Обробка відео завершена",
    adminHeaderSystemBackupCompleted: "Резервне копіювання системи завершено",
    adminHeaderMinutesAgo: "хвилин тому",
    adminHeaderHourAgo: "годину тому",
    adminHeaderAdminUser: "Адмін користувач",
  },
  
  tr: {
    // Navigation
    home: "Ana Sayfa",
    studio: "Stüdyo",
    pricing: "Fiyatlandırma",
    about: "Hakkımızda",
    contact: "İletişim",
    referrals: "Tavsiyeler",
    
    // Hero Section
    heroTitle: "5 dakikadan kısa sürede premium AI avatar videoları oluşturun.",
    heroSubtitle: "Kafeler, restoranlar, mağazalar ve içerik üreticileri için. Zarif, fütüristik, basit.",
    getStarted: "Başlayın",
    seePricing: "Fiyatları görün",
    
    // Trust indicators
    noCreditCard: "Kredi kartı gerekmez",
    fiveMinuteSetup: "5 dakikalık kurulum",
    hdQuality: "HD kalite videolar",
    
    // How it works
    howItWorks: "Nasıl çalışır",
    howItWorksSubtitle: "Sadece 4 basit adımda profesyonel pazarlama videoları oluşturun",
    step1Title: "Senaryonuzu yazın",
    step1Description: "Kısa bir senaryo yazın veya ürün tanıtımınızı yapıştırın. AI'mız bunu video için optimize edecek.",
    step2Title: "Avatar ve arka planları seçin",
    step2Description: "Markanız ve mesajınızla eşleşen bir avatar seçin ve 2-4 arka plan ayarlayın.",
    step3Title: "Görsel öğeler ekleyin",
    step3Description: "Kitlenizi etkileyecek görsel anlar için ürün, cihaz veya yemek görselleri ekleyin.",
    step4Title: "Dışa aktarın ve paylaşın",
    step4Description: "Hafif logo kaplaması ve paylaşıma hazır iletişim bilgilerinizle bir video dışa aktarın.",
    
    // Preview Section
    seeItInAction: "Aksiyonda görün",
    previewSubtitle: "Profesyonel pazarlama videoları oluşturmanın ne kadar kolay olduğunu izleyin",
    lightningFast: "Şimşek hızında",
    lightningFastDesc: "5 dakikadan kısa sürede üretin",
    hdQualityTitle: "HD Kalite",
    hdQualityDesc: "Profesyonel 4K videolar",
    autoPublishing: "Otomatik Yayınlama",
    autoPublishingDesc: "Doğrudan sosyal medyaya",
    
    // Pricing Section
    simplePricing: "Basit fiyatlandırma",
    pricingSubtitle: "İçerik üreticileri ve işletmeler için basit planlar. Fiyatlandırma sayfasında tam detayları görün.",
    seePricingButton: "Fiyatları görün",
    startNow: "Şimdi başlayın",
    
    // Account Menu
    account: "Hesap",
    dashboard: "Kontrol Paneli",
    profile: "Profil",
    myVideos: "Videolarım",
    subscription: "Abonelik",
    settings: "Ayarlar",
    adminPanel: "Admin Paneli",
    signOut: "Çıkış yap",
    
    // Footer
    footerTitle: "Harika videolar oluşturmaya hazır mısınız?",
    footerSubtitle: "MarketUp kullanan binlerce içerik üreticisine katılın",
    footerGetStarted: "Başlayın",
    footerFollowUs: "Bizi takip edin:",
    footerInstagram: "Instagram",
    footerFacebook: "Facebook",
    footerTikTok: "TikTok",
    footerCopyright: "©️ 2026 MarketUp. Tüm hakları saklıdır.",
    footerContact: "İletişim:",
    footerPrivacy: "Gizlilik",
    footerTerms: "Şartlar",
    footerCookies: "Çerezler",
    
    // Studio Page
    studioAccessDenied: "Erişim Reddedildi",
    studioSignInRequired: "Video oluşturmak için giriş yapın",
    studioSignIn: "Giriş Yap",
    studioStep: "Adım",
    studioOf: "/",
    studioChooseAvatar: "Avatar Seç",
    studioSelectPresenter: "Sanal sunucunuzu seçin",
    studioLanguageVoice: "Dil ve Ses",
    studioPickLanguage: "Dil ve ses seçin",
    studioBackgrounds: "Arka Planlar",
    studioChooseScenes: "Birden fazla sahne seçin",
    studioScript: "Senaryo",
    studioWriteMessage: "Mesajınızı yazın",
    studioGenerate: "Oluştur",
    studioCreateVideo: "Videonuzu oluşturun",
    studioPreview: "Önizleme",
    studioReviewDownload: "İnceleyin ve indirin",
    
    // Onboarding Page
    onboardingWelcome: "MarketUp'a Hoş Geldiniz",
    onboardingGetStarted: "Hadi başlayalım",
    onboardingSetupTime: "Hesabınızı sadece birkaç basit adımda kurmanıza yardımcı olacağız. Bu sadece 2 dakika sürecek.",
    onboardingPersonalize: "Kişiselleştir",
    onboardingPersonalizeDesc: "Ülkenizi ve dil tercihlerinizi seçin",
    onboardingConfigure: "Yapılandır",
    onboardingConfigureDesc: "Video oluşturma tercihlerinizi ayarlayın",
    onboardingCreate: "Oluştur",
    onboardingCreateDesc: "Harika AI videoları oluşturmaya başlayın",
    onboardingStep: "Adım",
    onboardingOf: "/",
    onboardingWhereLocated: "Nerede bulunuyorsunuz?",
    onboardingLocationDesc: "Bu, bölgeniz için ilgili içerik ve özellikler sağlamamıza yardımcı olur.",
    onboardingWhatLanguage: "Diliniz nedir?",
    onboardingLanguageDesc: "Arayüz ve içerik için tercih ettiğiniz dili seçin.",
    onboardingBack: "Geri",
    onboardingContinue: "Devam Et",
    onboardingSkip: "Şimdilik atla",
    onboardingCompleteSetup: "Kurulumu Tamamla",
    onboardingSettingUp: "Ayarlanıyor...",
    onboardingError: "Tercihler kaydedilemedi. Lütfen tekrar deneyin.",
    
    // Referrals Page
    referralsCreateCode: "Referans kodunuzu oluşturun",
    referralsGenerateLink: "Benzersiz bağlantınızı oluşturun",
    referralsYourUserId: "Kullanıcı ID'niz",
    referralsUserIdPlaceholder: "örn., usr_123",
    referralsGenerating: "Oluşturuluyor…",
    referralsGenerate: "Oluştur",
    referralsCodeReady: "Referans kodunuz hazır!",
    referralsYourCode: "Kodunuz",
    referralsCopyLink: "Bağlantıyı kopyala",
    referralsShareLink: "Bu bağlantıyı paylaşın:",
    referralsRedeemCode: "Kod kullan",
    referralsEnterCode: "Referans kodunu girin",
    referralsCode: "Kod",
    referralsCodePlaceholder: "Referans kodunu girin",
    referralsRedeeming: "Kullanılıyor…",
    referralsRedeem: "Kullan",
    referralsSuccess: "Başarı — hoş geldiniz!",
    referralsWelcome: "Başarı — hoş geldiniz!",
    referralsInvalidCode: "Geçersiz kod",
    referralsNetworkError: "Ağ hatası",
    referralsProvideUserId: "Kullanıcı ID'nizi girin.",
    referralsEnterCodeToRedeem: "Kullanmak için bir kod girin.",
    referralsHowReferralsWork: "Referanslar Nasıl Çalışır",
    referralsStartEarning: "kazanmaya başla",
    referralsGenerateStep: "Oluştur",
    referralsGenerateDesc: "Kişisel kodunuzu tek tıkla oluşturun.",
    referralsShareStep: "Paylaş",
    referralsShareDesc: "Bağlantınızı arkadaşlarınıza veya müşterilerinize gönderin.",
    referralsEarnStep: "Kazan",
    referralsEarnDesc: "Abone olduklarında ödüller kazanın.",
    referralsStep: "Adım",
    
    // Contact Page
    contactHearFromYou: "sizden duymak",
    contactQuestionsPartnerships: "Sorular, ortaklıklar veya basın — bize bir mesaj gönderin, kısa sürede yanıtlayalım.",
    contactResponseTime: "Genellikle 24 saat içinde yanıt veriyoruz.",
    contact24hResponse: "24 saat yanıt süresi",
    contactExpertSupport: "Uzman destek",
    contactNoSpam: "Asla spam yok",
    contactGetInTouch: "İletişime geçin",
    contactSendMessage: "Bize bir mesaj gönderin, 24 saat içinde size dönüş yapalım",
    contactThanksMessage: "Teşekkürler! Mesajınız gönderildi.",
    contactResponseTimeDesc: "Genellikle 24 saat içinde yanıt veriyoruz.",
    contactSendAnother: "Bir tane daha gönder",
    contactName: "Ad",
    contactNamePlaceholder: "Adınız",
    contactEmail: "E-posta",
    contactEmailPlaceholder: "siz@sirket.com",
    contactMessage: "Mesaj",
    contactMessagePlaceholder: "Nasıl yardımcı olabiliriz?",
    contactNoBotsSpam: "Bot yok, spam yok. E-postanızı sadece yanıtlamak için kullanacağız.",
    contactFillAllFields: "Lütfen tüm alanları doldurun.",
    contactValidEmail: "Geçerli bir e-posta adresi girin.",
    contactMessageLength: "Mesaj en az 10 karakter olmalıdır.",
    contactSending: "Gönderiliyor...",
    contactSendMessage: "Mesaj gönder",
    contactClear: "Temizle",
    contactSomethingWrong: "Bir şeyler ters gitti. Lütfen tekrar deneyin.",
    contactOtherWays: "Bize ulaşmanın diğer yolları",
    contactBusinessHours: "Çalışma Saatleri",
    contactBusinessHoursDesc: "Pzt-Cum, 09:00-18:00 EST",
    contactResponseTimeLabel: "Yanıt Süresi",
    contactResponseTimeValue: "24 saat içinde",
    contactEmailSupport: "E-posta Desteği",
    contactGetHelpEmail: "E-posta ile yardım alın",
    contactOnlineNow: "Şu anda çevrimiçi",
    contactEmailDescription: "Bize bir e-posta gönderin, 24 saat içinde size dönüş yapalım. Detaylı sorular, geri bildirim veya destek talepleri için mükemmel.",
    contactEmailButton: "support@marketup.app",
    contactEmailSupportMobile: "E-posta Desteği",
    contact24hResponseLabel: "24 saat yanıt",
    contactExpertSupportLabel: "Uzman destek",
    contactWhatsAppSupport: "WhatsApp Desteği",
    contactComingSoon: "Yakında",
    contactInDevelopment: "Geliştirme aşamasında",
    contactWhatsAppDescription: "WhatsApp desteği yakında anlık mesajlaşma ve hızlı sorular için kullanılabilir olacak.",
    contactWhatsAppButton: "WhatsApp (Yakında)",
    contactWhatsAppMobile: "WhatsApp",
    contactInstantChat: "Anlık sohbet",
    contactFrequentlyAsked: "Sık sorulan",
    contactQuestions: "sorular",
    contactQuickAnswers: "AI video platformumuz hakkında yaygın sorulara hızlı yanıtlar",
    contactAIVideoPlatform: "AI video platformu",
    contactHowLong: "Ne kadar sürer?",
    contactHowLongDesc: "AI'mız 5 dakikadan kısa sürede profesyonel pazarlama videoları üretir. Senaryonuzu yazın, avatar ve arka planları seçin, görseller ekleyin ve paylaşmaya hazır HD video dışa aktarın.",
    contactUnder5Minutes: "5 dakikadan az",
    contactHDQuality: "HD kalite",
    contactVideoQuality: "Video kalitesi?",
    contactVideoQualityDesc: "Profesyonel düzeyde AI avatarları ile HD kalitesinde videolar (1080p) üretiyoruz. Tüm videolar sosyal medya platformları için optimize edilmiş ve birden fazla formatta indirilebilir.",
    contact1080pHD: "1080p HD",
    contactMultipleFormats: "Birden fazla format",
    contactCustomVoice: "Özel ses?",
    contactCustomVoiceDesc: "Şu anda doğal ve profesyonel sesli AI üretimli sesler kullanıyoruz. Kendi sesinizle kişiselleştirilmiş videolar için ses klonlama özellikleri yakında.",
    contactComingSoonLabel: "Yakında",
    contactAIVoicesNow: "AI sesler şimdi",
    contactCommercialUse: "Ticari kullanım?",
    contactCommercialUseDesc: "Evet! Tüm planlar ticari kullanım haklarını içerir. Üretilen videoları pazarlama, reklam, sosyal medya ve herhangi bir iş amacı için ek lisans ücreti olmadan kullanın.",
    contactCommercialRights: "Ticari haklar",
    contactNoExtraFees: "Ek ücret yok",
    
    // Pricing Page
    pricingTransparentPricing: "Şeffaf Fiyatlandırma",
    pricingSimpleTransparent: "Basit, şeffaf fiyatlandırma",
    pricingChoosePerfectPlan: "AI video oluşturma ihtiyaçlarınız için mükemmel planı seçin.",
    pricingNoHiddenFees: "Gizli ücret yok, istediğiniz zaman iptal edin.",
    pricingMonthly: "Aylık",
    pricingYearly: "Yıllık",
    pricingSave20: "%20 Tasarruf",
    pricingFree: "Ücretsiz",
    pricingPro: "Pro",
    pricingEnterprise: "Kurumsal",
    pricingPerfectForGettingStarted: "Başlamak için mükemmel",
    pricingBestForProfessionals: "Profesyoneller ve içerik üreticileri için en iyi",
    pricingForTeamsOrganizations: "Ekipler ve büyük organizasyonlar için",
    pricingMostPopular: "En Popüler",
    pricingEnterpriseBadge: "Kurumsal",
    pricingGetStartedFree: "Ücretsiz Başla",
    pricingStartProTrial: "Pro Deneme Başlat",
    pricingContactSales: "Satış Ekibiyle İletişime Geç",
    pricing3VideosPerMonth: "Ayda 3 video",
    pricingStandardQuality720p: "Standart kalite (720p)",
    pricingBasicAvatars: "Temel avatarlar",
    pricing5Languages: "5 dil",
    pricingCommunitySupport: "Topluluk desteği",
    pricingWatermarkOnVideos: "Videolarda filigran",
    pricing50VideosPerMonth: "Ayda 50 video",
    pricingHDQuality1080p: "HD kalite (1080p)",
    pricingAllAvatarsVoices: "Tüm avatarlar ve sesler",
    pricing20PlusLanguages: "20+ dil",
    pricingPrioritySupport: "Öncelikli destek",
    pricingNoWatermark: "Filigran yok",
    pricingCustomBackgrounds: "Özel arka planlar",
    pricingAdvancedEditingTools: "Gelişmiş düzenleme araçları",
    pricingAPIAccess: "API erişimi",
    pricingUnlimitedVideos: "Sınırsız video",
    pricing4KQuality2160p: "4K kalite (2160p)",
    pricingCustomAvatars: "Özel avatarlar",
    pricingAllLanguagesVoices: "Tüm diller ve sesler",
    pricingDedicatedSupport: "Özel destek",
    pricingCustomBranding: "Özel markalama",
    pricingTeamCollaboration: "Ekip işbirliği",
    pricingAdvancedAnalytics: "Gelişmiş analitik",
    pricingWhiteLabelSolution: "White-label çözüm",
    pricingCustomIntegrations: "Özel entegrasyonlar",
    pricingSLAGuarantee: "SLA garantisi",
    pricingFeatureComparison: "Özellik Karşılaştırması",
    pricingCompareAllFeatures: "Tüm özellikleri karşılaştır",
    pricingEverythingYouNeed: "Doğru planı seçmek için ihtiyacınız olan her şey",
    pricingFeatures: "Özellikler",
    pricingVideoCreation: "Video Oluşturma",
    pricingAvatarsVoices: "Avatarlar ve Sesler",
    pricingSupport: "Destek",
    pricingVideosPerMonth: "Ayda video",
    pricingVideoQuality: "Video kalitesi",
    pricingVideoDuration: "Video süresi",
    pricingExportFormats: "Dışa aktarma formatları",
    pricingAvailableAvatars: "Mevcut avatarlar",
    pricingVoiceOptions: "Ses seçenekleri",
    pricingVoiceQuality: "Ses kalitesi",
    pricingCustomVoices: "Özel sesler",
    pricingBackgroundOptions: "Arka plan seçenekleri",
    pricingEmailSupport: "E-posta desteği",
    pricingFrequentlyAsked: "Sık sorulan",
    pricingQuestions: "sorular",
    pricingEverythingYouNeedToKnow: "Fiyatlandırmamız hakkında bilmeniz gereken her şey",
    pricingCanChangePlanAnytime: "Planımı istediğim zaman değiştirebilir miyim?",
    pricingCanChangePlanAnytimeAnswer: "Evet, planınızı istediğiniz zaman yükseltebilir veya düşürebilirsiniz. Değişiklikler hemen geçerli olur ve faturalama farklarını orantılı olarak hesaplarız.",
    pricingWhatHappensToVideos: "Planımı düşürürsem videolarıma ne olur?",
    pricingWhatHappensToVideosAnswer: "Mevcut videolarınız erişilebilir kalır. Sadece yeni planınıza göre yeni video oluşturma için azaltılmış limitleriniz olur.",
    pricingDoYouOfferRefunds: "Para iadesi sunuyor musunuz?",
    pricingDoYouOfferRefundsAnswer: "Tüm ücretli planlar için 30 günlük para iadesi garantisi sunuyoruz. Memnun değilseniz destek ekibimizle iletişime geçin.",
    pricingCanCancelSubscription: "Aboneliğimi iptal edebilir miyim?",
    pricingCanCancelSubscriptionAnswer: "Evet, hesap ayarlarınızdan istediğiniz zaman iptal edebilirsiniz. Aboneliğiniz faturalama döneminizin sonuna kadar aktif kalır.",
    pricingCustomEnterpriseSolutions: "Özel kurumsal çözümler sunuyor musunuz?",
    pricingCustomEnterpriseSolutionsAnswer: "Kesinlikle! Organizasyonunuz için özel fiyatlandırma, özellikler ve entegrasyonları görüşmek üzere satış ekibimizle iletişime geçin.",
    pricingGetStarted: "Başlayın",
    pricingReadyToCreate: "Harika AI videoları oluşturmaya hazır mısınız?",
    pricingJoinThousands: "Profesyonel AI avatar videoları oluşturmak için platformumuzu kullanan binlerce içerik üreticisi ve işletmeye katılın.",
    pricingStartFreeTrial: "Ücretsiz Deneme Başlat",
    pricingContactSales: "Satış Ekibiyle İletişime Geç",
    pricingSavePerYear: "Yılda $ tasarruf",
    pricingForever: "sonsuza kadar",
    pricingMonth: "ay",
    pricingYear: "yıl",
    
    // Studio Wizard Components
    studioChooseAvatar: "Avatar Seç",
    studioSelectPresenter: "Sunucu Seç",
    studioLanguageVoice: "Dil ve Ses",
    studioPickLanguage: "Dil Seç",
    studioBackgrounds: "Arka Planlar",
    studioChooseScenes: "Sahne Seç",
    studioScript: "Senaryo",
    studioWriteMessage: "Mesaj Yaz",
    studioGenerate: "Oluştur",
    studioCreateVideo: "Video Oluştur",
    studioPreview: "Önizleme",
    studioReviewDownload: "İncele ve İndir",
    studioStep: "Adım",
    studioOf: "of",
    studioAccessDenied: "Erişim Reddedildi",
    studioSignInRequired: "Stüdyoya erişmek için giriş yapın",
    studioSignIn: "Giriş Yap",
    
    // Avatar Step
    studioChooseYourAvatar: "Avatarınızı seçin",
    studioSelectVirtualPresenter: "Mesajınızı iletecek sanal sunucuyu seçin.",
    studioEachAvatarUnique: "Her avatarın benzersiz kişiliği ve konuşma tarzı vardır.",
    studioPreview: "Önizleme",
    studioWillPresentVideo: "videonuzu sunacak",
    studioContinue: "Devam Et",
    
    // Language Step
    studioLanguageVoice: "Dil ve Ses",
    studioChooseLanguageVoice: "Videonuz için dil ve ses seçin.",
    studioPreviewEachVoice: "Seçmeden önce her sesi önizleyebilirsiniz.",
    studioSelectLanguage: "Dil Seç",
    studioChooseVoice: "Ses Seç",
    studioAllTones: "Tüm Tonlar",
    studioProfessional: "Profesyonel",
    studioEnergetic: "Enerjik",
    studioCalm: "Sakin",
    studioExpressive: "İfadeli",
    studioPlaying: "Çalıyor...",
    studioPreview: "Önizleme",
    studioSelectedVoice: "Seçilen Ses",
    studioBack: "Geri",
    studioContinue: "Devam Et",
    
    // Background Step
    studioChooseBackgrounds: "Arka Planları Seç",
    studioSelectMultipleBackgrounds: "Videonuz için birden fazla arka plan seçin.",
    studioChoose2To4Scenes: "Dinamik geçişler oluşturmak için 2-4 farklı sahne seçebilirsiniz.",
    studioAll: "Tümü",
    studioProfessional: "Profesyonel",
    studioCasual: "Günlük",
    studioCreative: "Yaratıcı",
    studioBackgroundsSelected: "arka plan seçildi",
    studioPreview: "Önizleme",
    studioPreviewMode: "Önizleme Modu",
    studioExitPreview: "Önizlemeden Çık",
    studioSelectedBackgrounds: "Seçilen Arka Planlar",
    studioMoreBackgrounds: "daha fazla arka plan",
    studioBack: "Geri",
    studioContinue: "Devam Et",
    
    // Text Step
    studioWriteYourScript: "Senaryonuzu yazın",
    studioWriteTextAvatarSpeak: "Avatarınızın konuşacağı metni yazın.",
    studioStartWithTemplate: "Bir şablonla başlayabilir veya kendi içeriğinizi yazabilirsiniz.",
    studioQuickTemplates: "Hızlı Şablonlar",
    studioWelcomeMessage: "Hoş Geldin Mesajı",
    studioProductIntroduction: "Ürün Tanıtımı",
    studioTrainingIntroduction: "Eğitim Girişi",
    studioCompanyAnnouncement: "Şirket Duyurusu",
    studioTutorialIntroduction: "Eğitim Girişi",
    studioSpecialOffer: "Özel Teklif",
    studioBusiness: "İş",
    studioMarketing: "Pazarlama",
    studioEducation: "Eğitim",
    studioYourScript: "Senaryonuz",
    studioWords: "kelime",
    studioCharacters: "karakter",
    studioDuration: "süre",
    studioShort: "Kısa",
    studioMedium: "Orta",
    studioLong: "Uzun",
    studioWriteScriptHere: "Senaryonuzu buraya yazın... Avatarınız bu metni doğal olarak konuşacak.",
    studioWritingTips: "Yazma İpuçları",
    studioNaturalSpeech: "Doğal Konuşma",
    studioWriteAsYouSpeak: "Doğal olarak konuştuğunuz gibi yazın, duraklamalar ve vurgularla.",
    studioOptimalLength: "Optimal Uzunluk",
    studioKeepVideos30To120: "En iyi etkileşim için videoları 30-120 saniye arasında tutun.",
    studioClearStructure: "Net Yapı",
    studioStartWithHook: "Bir kanca ile başlayın, mesajınızı iletin ve bir eylem çağrısı ile bitirin.",
    studioPronunciation: "Telaffuz",
    studioUsePhoneticSpelling: "Zor kelimeler için fonetik yazım kullanın: \"AI\" için \"A-I\".",
    studioPreview: "Önizleme",
    studioBack: "Geri",
    studioContinue: "Devam Et",
    
    // Generation Step
    studioGenerateYourVideo: "Videonuzu Oluşturun",
    studioCreatePersonalizedVideo: "AI kullanarak kişiselleştirilmiş videonuzu oluşturacağız.",
    studioProcessTakes2To3Minutes: "Bu işlem genellikle 2-3 dakika sürer.",
    studioVideoSummary: "Video Özeti",
    studioAvatar: "Avatar",
    studioBackground: "Arka Plan",
    studioDuration: "Süre",
    studioWords: "kelime",
    studioGeneratingYourVideo: "Videonuz Oluşturuluyor",
    studioDontCloseWindow: "Lütfen videonuzu oluştururken bu pencereyi kapatmayın.",
    studioProgress: "İlerleme",
    studioPreparingAssets: "Varlıklar hazırlanıyor",
    studioGeneratingAvatarAnimation: "Avatar animasyonu oluşturuluyor",
    studioSynthesizingVoice: "Ses sentezleniyor",
    studioProcessingBackground: "Arka plan işleniyor",
    studioCompositingVideo: "Video kompozisyonu",
    studioFinalizingOutput: "Çıktı tamamlanıyor",
    studioComplete: "Tamamlandı",
    studioProcessing: "İşleniyor...",
    studioEstimatedTimeRemaining: "Tahmini kalan süre:",
    studioCancelGeneration: "Oluşturmayı İptal Et",
    studioReadyToGenerate: "Oluşturmaya Hazır",
    studioVideoCreatedWithSettings: "Videonuz yukarıdaki ayarlarla oluşturulacak.",
    studioStartGeneration: "Oluşturmayı Başlat",
    studioBack: "Geri",
    studioGenerationTakes2To3Minutes: "Oluşturma genellikle 2-3 dakika sürer",
    
    // Preview Step
    studioYourVideoReady: "Videonuz Hazır!",
    studioReviewGeneratedVideo: "Oluşturulan videonuzu inceleyin ve sonuçtan memnun olduğunuzda indirin.",
    studioDownloadWhenSatisfied: "Sonuçtan memnun olduğunuzda indirin.",
    studioPlaying: "Çalıyor...",
    studioClickToPreview: "Önizleme için tıklayın",
    studioDuration: "Süre",
    studioQuality: "Kalite",
    studioFormat: "Format",
    studioFileSize: "Dosya Boyutu",
    studioVideoSettings: "Video Ayarları",
    studioVoice: "Ses",
    studioBackground: "Arka Plan",
    studioResolution: "Çözünürlük",
    studioScriptLength: "Senaryo Uzunluğu",
    studioScript: "Senaryo",
    studioActions: "Eylemler",
    studioDownloading: "İndiriliyor...",
    studioDownloadVideo: "Videoyu İndir",
    studioRegenerate: "Yeniden Oluştur",
    studioSaveContinue: "Kaydet ve Devam Et",
    studioDownloadProgress: "İndirme İlerlemesi",
    studioBack: "Geri",
    studioVideoGeneratedSuccessfully: "Video başarıyla oluşturuldu",
    
    // About Page
    aboutTitle: "MarketUp Hakkında",
    aboutWelcome: "MarketUp'e hoş geldiniz, küçük dükkan sahiplerinden ve kafelerden büyük şirketlere kadar herkese işlerini tanıtmada yardımcı olmak için tasarlanmış Avrupa merkezli bir platform",
    aboutEasilyAffordably: "kolay ve uygun fiyatlı.",
    aboutEuropeanPlatform: "Avrupa platformu",
    aboutForEveryone: "Herkes için",
    aboutEasyAffordable: "Kolay ve uygun fiyatlı",
    aboutOurMissionVision: "Misyonumuz ve Vizyonumuz",
    aboutDrivingInnovation: "Pazarlama teknolojisinde inovasyonu yönlendiriyoruz",
    aboutEveryone: "herkes için",
    aboutOurMission: "Misyonumuz",
    aboutMissionText: "Misyonumuz, bireylerin ve işletmelerin pahalı reklam ajanslarına ihtiyaç duymadan ürün veya hizmetlerini tanıtmalarını sağlamak — sadece basit, akıllı ve etkili pazarlama.",
    aboutOurVision: "Vizyonumuz",
    aboutVisionText: "Geleceğe dair vizyonumuz, MarketUp'i pazarlamayı tüm kullanıcılar için daha da kolay ve güçlü hale getiren yeni ve yenilikçi yollarla genişletmektir.",
    aboutWhatMakesDifferent: "Bizi Farklı Kılan Nedir",
    aboutDifferentText: "Bizi farklı kılan şey, odaklandığımız",
    aboutSimplicityQualityAccessibility: "basitlik, kalite ve erişilebilirlik.",
    aboutWhatMarketUpOffers: "MarketUp Ne Sunuyor",
    aboutComprehensiveSolutions: "Tüm ihtiyaçlarınız için kapsamlı çözümler",
    aboutMarketingNeeds: "pazarlama ihtiyaçları",
    aboutSmartAIVideo: "Akıllı AI destekli video oluşturma",
    aboutForMarketing: "pazarlama için",
    aboutAffordablePricing: "Uygun fiyatlı fiyatlandırma planları",
    aboutSuitableForAll: "tüm kullanıcılar için uygun",
    aboutMultilingualSupport: "Çok dilli destek ekibi",
    aboutLanguages: "İngilizce, Arapça, İsveççe ve Türkçe",
    aboutEasyToUse: "Kullanımı kolay araçlar",
    aboutMakeVideoMarketing: "video pazarlamayı daha hızlı, yaratıcı ve herkesin erişebileceği hale getiren",
    aboutActive: "Aktif",
    aboutOurCommitment: "Taahhüdümüz",
    aboutCommitmentText: "Her müşteri için mümkün olan en iyi deneyimi sunmak için sürekli destek, daha akıllı araçlar ve yaratıcı çözümler sağlamayı hedefliyoruz.",
    aboutQuote: "MarketUp – fikirlerinizin pazarlama gücüne dönüştüğü yer",
    aboutOurSlogans: "Sloganlarımız",
    aboutSlogan: "Slogan",
    aboutSloganText: "MarketUp – işinizin görülmeyi hak ettiği yer",
    aboutTagline: "Slogan",
    aboutTaglineText: "Hikayeniz, teknolojimiz – başarı için tek vizyon",
    aboutReadyToTransform: "Pazarlamanızı dönüştürmeye hazır mısınız",
    aboutMarketing: "pazarlama?",
    aboutJoinThousands: "Profesyonel pazarlama videoları oluşturmak için zaten MarketUp'i kullanan binlerce işletmeye katılın.",
    aboutGetStarted: "Başlayın",
    aboutSeePricing: "Fiyatları Görün",
    
    // Dashboard Page
    dashboardWelcomeBack: "Tekrar hoş geldiniz,",
    dashboardCreator: "Yaratıcı!",
    dashboardTotalVideos: "Toplam Video",
    dashboardThisMonth: "bu ay",
    dashboardCurrentPlan: "Mevcut Plan",
    dashboardFreePlan: "Ücretsiz Plan",
    dashboardUpgradeToPro: "Pro'ya Yükselt",
    dashboardStorageUsed: "Kullanılan Depolama",
    dashboardOfUsed: "kullanılan",
    dashboardCompleted: "Tamamlandı",
    dashboardReadyToView: "Görüntülemeye hazır",
    dashboardProcessing: "İşleniyor",
    dashboardInProgress: "Devam ediyor",
    dashboardTotalViews: "Toplam Görüntüleme",
    dashboardAllTime: "Tüm zamanlar",
    dashboardDownloads: "İndirmeler",
    dashboardQuickActions: "Hızlı İşlemler",
    dashboardCreateVideo: "Video Oluştur",
    dashboardStartNewProject: "Yeni bir video projesi başlat",
    dashboardMyVideos: "Videolarım",
    dashboardViewAllVideos: "Tüm videolarınızı görüntüleyin",
    dashboardUpgradePlan: "Planı Yükselt",
    dashboardManageSubscription: "Aboneliğinizi yönetin",
    dashboardSettings: "Ayarlar",
    dashboardAccountPreferences: "Hesap tercihleri",
    dashboardRecentVideos: "Son Videolar",
    dashboardViewAll: "Tümünü Görüntüle →",
    dashboardViews: "görüntüleme",
    dashboardNoVideosYet: "Henüz video yok",
    dashboardCreateFirstVideo: "Başlamak için ilk videonuzu oluşturun",
    
    // Profile Page
    profileAnonymousUser: "Anonim kullanıcı",
    profileNotSet: "Ayarlanmamış",
    profileCancel: "İptal",
    profileEditProfile: "Profili Düzenle",
    profilePersonalInformation: "Kişisel Bilgiler",
    profileFullName: "Ad Soyad",
    profileEnterFullName: "Adınızı ve soyadınızı girin",
    profileEmailAddress: "E-posta Adresi",
    profileEnterEmail: "E-postanızı girin",
    profileEmailCannotBeChanged: "E-posta değiştirilemez",
    profileBio: "Biyografi",
    profileTellAboutYourself: "Kendiniz hakkında bilgi verin...",
    profileCountry: "Ülke",
    profileSelectCountry: "Ülkenizi seçin",
    profileLanguage: "Dil",
    profileSelectLanguage: "Dilinizi seçin",
    profileCompany: "Şirket",
    profileCompanyName: "Şirket adınız",
    profileWebsite: "Web sitesi",
    profileWebsiteUrl: "https://websiteniz.com",
    profileSaving: "Kaydediliyor...",
    profileSaveChanges: "Değişiklikleri Kaydet",
    profileProfileStats: "Profil İstatistikleri",
    profileProfileCompletion: "Profil Tamamlanma",
    profileVideos: "Videolar",
    profileProjects: "Projeler",
    profileAccountSettings: "Hesap Ayarları",
    profileChangePassword: "Şifre Değiştir",
    profileUpdatePassword: "Şifrenizi güncelleyin",
    profileTwoFactorAuth: "İki Faktörlü Kimlik Doğrulama",
    profileAddExtraSecurity: "Ek güvenlik ekleyin",
    profileDeleteAccount: "Hesabı Sil",
    profilePermanentlyDeleteAccount: "Hesabı kalıcı olarak sil",
    
    // Videos Page
    videosMyVideos: "Videolarım",
    videosManageViewAll: "Oluşturduğunuz tüm videoları yönetin ve görüntüleyin",
    videosCreateNewVideo: "Yeni Video Oluştur",
    videosSearchVideos: "Videoları ara...",
    videosAll: "Tümü",
    videosCompleted: "Tamamlandı",
    videosProcessing: "İşleniyor",
    videosQueued: "Kuyrukta",
    videosLoadingVideos: "Videolar yükleniyor...",
    videosStatus: "Durum",
    videosDuration: "Süre",
    videosViews: "Görüntüleme",
    videosDownloads: "İndirme",
    videosView: "Görüntüle",
    videosEdit: "Düzenle",
    videosDownload: "İndir",
    videosShare: "Paylaş",
    videosDuplicate: "Kopyala",
    videosDelete: "Sil",
    videosProcessingStatus: "İşleniyor...",
    videosNoVideosFound: "Video bulunamadı",
    videosTryAdjustingSearch: "Arama terimlerinizi ayarlamayı deneyin",
    videosCreateFirstVideo: "Başlamak için ilk videonuzu oluşturun",
    videosCreateVideo: "Video Oluştur",
    videosPage: "Sayfa",
    videosOf: "toplam",
    videosPrevious: "Önceki",
    videosPrev: "Önce",
    videosNext: "Sonraki",
    videosDownloadFunctionalityComingSoon: "İndirme işlevselliği yakında geliyor!",
    videosShareFunctionalityComingSoon: "Paylaşım işlevselliği yakında geliyor!",
    videosDeleteFunctionalityComingSoon: "Silme işlevselliği yakında geliyor!",
    videosDuplicateFunctionalityComingSoon: "Kopyalama işlevselliği yakında geliyor!",
    videosAreYouSureDelete: "Bu videoyu silmek istediğinizden emin misiniz?",
    
    // Subscription Page
    subscriptionManagement: "Abonelik Yönetimi",
    subscriptionManageBillingUpgrade: "Aboneliğinizi yönetin, faturalandırmayı yapın ve daha fazla özellik açmak için planınızı yükseltin",
    subscriptionCurrentPlan: "Mevcut Plan",
    subscriptionManageSubscriptionBilling: "Aboneliğinizi ve faturalandırmayı yönetin",
    subscriptionCancelling: "İptal ediliyor",
    subscriptionEnds: "Biter",
    subscriptionNextBilling: "Sonraki Faturalandırma",
    subscriptionUsageThisMonth: "Bu Ay Kullanım",
    subscriptionVideosCreated: "Video oluşturuldu",
    subscriptionUsed: "kullanıldı",
    subscriptionChangePlan: "Planı Değiştir",
    subscriptionUpdatePayment: "Ödemeyi Güncelle",
    subscriptionCancelSubscription: "Aboneliği İptal Et",
    subscriptionReactivate: "Yeniden Etkinleştir",
    subscriptionUpgradePlan: "Planı Yükselt",
    subscriptionAvailablePlans: "Mevcut Planlar",
    subscriptionChoosePlanBestFits: "İhtiyaçlarınıza en uygun planı seçin ve daha fazla özellik açın",
    subscriptionMostPopular: "En Popüler",
    subscriptionChoosePlan: "Plan Seç",
    subscriptionBillingHistory: "Faturalandırma Geçmişi",
    subscriptionTrackPaymentHistory: "Ödeme geçmişinizi takip edin ve faturaları indirin",
    subscriptionDownload: "İndir",
    subscriptionNoBillingHistory: "Faturalandırma geçmişi yok",
    subscriptionBillingHistoryWillAppear: "Faturalandırma geçmişiniz burada görünecek",
    subscriptionErrorLoadingData: "Abonelik verileri yüklenirken hata",
    subscriptionPleaseTryRefreshing: "Lütfen sayfayı yenilemeyi deneyin",
    subscriptionRefreshPage: "Sayfayı Yenile",
    subscriptionChangePlanFunctionalityComingSoon: "Plan değiştirme işlevselliği yakında geliyor!",
    subscriptionUpdatePaymentFunctionalityComingSoon: "Ödeme güncelleme işlevselliği yakında geliyor!",
    subscriptionCancelSubscriptionFunctionalityComingSoon: "Abonelik iptal işlevselliği yakında geliyor!",
    subscriptionUpgradePlanFunctionalityComingSoon: "Plan yükseltme işlevselliği yakında geliyor!",
    subscriptionDownloadInvoiceFunctionalityComingSoon: "Fatura indirme işlevselliği yakında geliyor!",
    subscriptionUpgradeToPlanFunctionalityComingSoon: "{plan} planına yükseltme işlevselliği yakında geliyor!",
    
    // Billing Page
    billingInvoices: "Faturalandırma ve Faturalar",
    billingManageBillingInformation: "Faturalandırma bilgilerinizi, ödeme yöntemlerinizi yönetin ve kullanımınızı takip edin",
    billingOverview: "Genel Bakış",
    billingPaymentMethods: "Ödeme Yöntemleri",
    billingUsage: "Kullanım",
    billingErrorLoadingData: "Faturalandırma verileri yüklenirken hata",
    billingPleaseTryRefreshing: "Lütfen sayfayı yenilemeyi deneyin",
    billingRefreshPage: "Sayfayı Yenile",
    billingCurrentBillingPeriod: "Mevcut Faturalandırma Dönemi",
    billingPeriod: "Dönem",
    billingCurrentBillingCycle: "Mevcut faturalandırma döngüsü",
    billingAmount: "Tutar",
    billingStatus: "Durum",
    billingFreePlan: "Ücretsiz plan",
    billingAutoRenewalEnabled: "Otomatik yenileme etkin",
    billingUsageThisMonth: "Bu Ay Kullanım",
    billingVideosCreated: "Video Oluşturuldu",
    billingOf: "of",
    billingStorageUsed: "Depolama Kullanıldı",
    billingBandwidth: "Bant Genişliği",
    billingThisMonth: "bu ay",
    billingInvoiceHistory: "Fatura Geçmişi",
    billingNoInvoicesYet: "Henüz fatura yok",
    billingInvoiceHistoryWillAppear: "Fatura geçmişiniz burada görünecek",
    billingDownload: "İndir",
    billingAddPaymentMethod: "Ödeme Yöntemi Ekle",
    billingDefault: "Varsayılan",
    billingEdit: "Düzenle",
    billingNoPaymentMethod: "Ödeme yöntemi yok",
    billingAddPaymentMethodToManage: "Aboneliğinizi yönetmek için bir ödeme yöntemi ekleyin",
    billingDetailedUsage: "Detaylı Kullanım",
    billingBandwidthThisMonth: "Bu Ay Bant Genişliği",
    billingUnlimited: "Sınırsız",
    
    // Settings Page
    settingsTitle: "Ayarlar",
    settingsManageAccountPreferences: "Hesap tercihlerinizi, bildirimlerinizi ve güvenlik ayarlarınızı yönetin",
    settingsMemberSince: "Üye olma tarihi",
    settingsSaving: "Kaydediliyor...",
    settingsSaveChanges: "Değişiklikleri Kaydet",
    settingsAccountInformation: "Hesap Bilgileri",
    settingsEmail: "E-posta",
    settingsName: "Ad",
    settingsCountry: "Ülke",
    settingsSelectCountry: "Ülke Seçin",
    settingsNotifications: "Bildirimler",
    settingsEmailNotifications: "E-posta Bildirimleri",
    settingsReceiveNotificationsViaEmail: "E-posta ile bildirim alın",
    settingsPushNotifications: "Push Bildirimleri",
    settingsReceivePushNotificationsInBrowser: "Tarayıcınızda push bildirimleri alın",
    settingsMarketingEmails: "Pazarlama E-postaları",
    settingsReceiveUpdatesAboutNewFeatures: "Yeni özellikler ve ipuçları hakkında güncellemeler alın",
    settingsProductUpdates: "Ürün Güncellemeleri",
    settingsGetNotifiedAboutNewFeatures: "Yeni özellikler ve iyileştirmeler hakkında bilgilendirilme alın",
    settingsPrivacySecurity: "Gizlilik ve Güvenlik",
    settingsProfileVisibility: "Profil Görünürlüğü",
    settingsControlWhoCanSeeProfile: "Profil bilgilerinizi kimin görebileceğini kontrol edin",
    settingsPublic: "Herkese Açık",
    settingsPrivate: "Özel",
    settingsFriendsOnly: "Sadece Arkadaşlar",
    settingsAnalytics: "Analitik",
    settingsHelpUsImproveBySharing: "Anonim kullanım verilerini paylaşarak gelişmemize yardımcı olun",
    settingsDataSharing: "Veri Paylaşımı",
    settingsAllowSharingDataWithPartners: "Üçüncü taraf ortaklarla veri paylaşımına izin verin",
    settingsPreferences: "Tercihler",
    settingsTheme: "Tema",
    settingsDark: "Koyu",
    settingsLight: "Açık",
    settingsAuto: "Otomatik",
    settingsLanguage: "Dil",
    settingsEnglish: "English",
    settingsUkrainian: "Українська",
    settingsSpanish: "Español",
    settingsFrench: "Français",
    settingsTimezone: "Saat Dilimi",
    settingsUTC: "UTC",
    settingsEasternTime: "Doğu Saati",
    settingsPacificTime: "Pasifik Saati",
    settingsLondon: "Londra",
    settingsKiev: "Kiev",
    settingsDateFormat: "Tarih Formatı",
    settingsMMDDYYYY: "MM/DD/YYYY",
    settingsDDMMYYYY: "DD/MM/YYYY",
    settingsYYYYMMDD: "YYYY-MM-DD",
    settingsDangerZone: "Tehlikeli Bölge",
    settingsExportData: "Veri Dışa Aktar",
    settingsDownloadCopyOfData: "Verilerinizin bir kopyasını indirin",
    settingsExport: "Dışa Aktar",
    settingsDeleteAccount: "Hesabı Sil",
    settingsPermanentlyDeleteAccount: "Hesabınızı ve tüm verilerinizi kalıcı olarak silin",
    settingsSettingsSavedSuccessfully: "Ayarlar başarıyla kaydedildi!",
    settingsErrorSavingSettings: "Ayarları kaydetme hatası. Lütfen tekrar deneyin.",
    settingsDataExportFeatureComingSoon: "Veri dışa aktarma özelliği yakında geliyor!",
    settingsAccountDeletionFeatureComingSoon: "Hesap silme özelliği yakında geliyor!",
    settingsAreYouSureDeleteAccount: "Hesabınızı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.",
    
    // Remember Me Settings
    rememberMeSettings: "Beni Hatırla Ayarları",
    rememberMeDescription: "Beni Hatırla, güvenilir cihazlarda 30 güne kadar oturum açık kalmanızı sağlar. Paylaşılan veya halka açık bir bilgisayar kullanıyorsanız, bu özelliği kullanmamanızı öneririz.",
    rememberMeClearSessions: "Beni Hatırla Oturumlarını Temizle",
    rememberMeClearSessionsDescription: "Bu, hatırlanmayı seçtiğiniz tüm cihazlardan sizi çıkış yapacak.",
    rememberMeClearing: "Temizleniyor...",
    rememberMeClearAllSessions: "Tüm Oturumları Temizle",
    rememberMeSessionsClearedSuccessfully: "Beni hatırla oturumları başarıyla temizlendi",
    rememberMeFailedToClearSessions: "Beni hatırla oturumları temizlenemedi",
    rememberMeErrorOccurred: "Oturumlar temizlenirken bir hata oluştu",
    
    // Dashboard Sidebar
    dashboardSidebarTitle: "Kontrol Paneli",
    dashboardSidebarWelcomeBack: "Tekrar hoş geldiniz",
    dashboardSidebarOverview: "Genel Bakış",
    dashboardSidebarProfile: "Profil",
    dashboardSidebarVideos: "Videolar",
    dashboardSidebarSubscription: "Abonelik",
    dashboardSidebarBilling: "Faturalandırma",
    dashboardSidebarSettings: "Ayarlar",
    dashboardSidebarAccount: "Hesap",
    dashboardSidebarSignOut: "Çıkış yap",
    dashboardSidebarManageAccount: "Hesabınızı ve tercihlerinizi yönetin",
    
    // Admin Panel
    adminOverview: "Platform metriklerinizin ve analizlerinizin genel bakışı",
    adminOverviewDescription: "Platform metriklerinizin ve analizlerinizin genel bakışı",
    adminExportReport: "Raporu Dışa Aktar",
    adminRefreshing: "Yenileniyor...",
    adminRefreshData: "Verileri Yenile",
    adminTotalUsers: "Toplam Kullanıcı",
    adminTotalRevenue: "Toplam Gelir",
    adminVideosCreated: "Oluşturulan Videolar",
    adminActiveUsers: "Aktif Kullanıcılar",
    adminRevenueTrend: "Gelir Trendi",
    adminRevenue: "Gelir",
    adminUserActivity: "Kullanıcı Aktivitesi",
    adminActiveUsers: "Aktif Kullanıcılar",
    adminChartVisualizationComingSoon: "Grafik görselleştirmesi yakında geliyor",
    adminRecentActivity: "Son Aktivite",
    adminNoRecentActivity: "Son aktivite yok",
    adminActivityWillAppearHere: "Kullanıcılar platformla etkileşime girdikçe aktivite burada görünecek",
    adminErrorLoadingData: "Admin verileri yüklenirken hata",
    adminTryAgain: "Tekrar Dene",
    adminNetworkErrorOccurred: "Ağ hatası oluştu",
    
    // Admin Users Management
    adminUsersManagement: "Kullanıcı Yönetimi",
    adminUsersManagementDescription: "Platform kullanıcılarını, hesaplarını ve izinlerini yönetin",
    adminAddUser: "Kullanıcı Ekle",
    adminSearchFilters: "Arama ve Filtreler",
    adminSearchUsers: "Kullanıcıları ara...",
    adminAllStatus: "Tüm Durumlar",
    adminActive: "Aktif",
    adminInactive: "Pasif",
    adminSuspended: "Askıya Alınmış",
    adminAllSubscriptions: "Tüm Abonelikler",
    adminFree: "Ücretsiz",
    adminBasic: "Temel",
    adminPremium: "Premium",
    adminEnterprise: "Kurumsal",
    adminSortByJoinDate: "Katılım Tarihine Göre Sırala",
    adminSortByName: "İsme Göre Sırala",
    adminSortByEmail: "E-postaya Göre Sırala",
    adminSortByLastActive: "Son Aktifliğe Göre Sırala",
    adminSortByVideos: "Videolara Göre Sırala",
    adminSortByTotalSpent: "Toplam Harcamaya Göre Sırala",
    adminUsersSelected: "kullanıcı seçildi",
    adminUserSelected: "kullanıcı seçildi",
    adminActivate: "Aktifleştir",
    adminSuspend: "Askıya Al",
    adminDelete: "Sil",
    adminClear: "Temizle",
    adminUser: "Kullanıcı",
    adminStatus: "Durum",
    adminSubscription: "Abonelik",
    adminVideos: "Videolar",
    adminTotalSpent: "Toplam Harcama",
    adminLastActive: "Son Aktif",
    adminActions: "İşlemler",
    adminShowingUsers: "Gösteriliyor",
    adminOfUsers: "toplam",
    adminPrevious: "Önceki",
    adminNext: "Sonraki",
    adminEditUser: "Kullanıcıyı Düzenle",
    adminName: "Ad",
    adminEmail: "E-posta",
    adminRole: "Rol",
    adminUserRole: "Kullanıcı",
    adminAdminRole: "Yönetici",
    adminModeratorRole: "Moderatör",
    adminSaveChanges: "Değişiklikleri Kaydet",
    adminCancel: "İptal",
    adminUserUpdatedSuccessfully: "Kullanıcı başarıyla güncellendi!",
    adminFailedToUpdateUser: "Kullanıcı güncellenemedi:",
    adminErrorUpdatingUser: "Kullanıcı güncellenirken hata",
    adminAreYouSureDeleteUsers: "Silmek istediğinizden emin misiniz",
    adminUsersDeletedSuccessfully: "kullanıcı başarıyla silindi!",
    adminFailedToDeleteUsers: "Kullanıcılar silinemedi:",
    adminErrorPerformingAction: "İşlem yapılırken hata",
    adminActionComingSoon: "işlemi için",
    
    // Admin Videos Management
    adminVideosModeration: "Video Moderasyonu",
    adminVideosModerationDescription: "Kullanıcılar tarafından yüklenen video içeriğini inceleyin ve moderasyon yapın",
    adminVideosToReview: "inceleme için video",
    adminVideosSearchFilters: "Arama ve Filtreler",
    adminVideosSearch: "Arama",
    adminVideosSearchPlaceholder: "Videoları veya yükleyicileri arayın...",
    adminVideosStatus: "Durum",
    adminVideosAllStatus: "Tüm Durumlar",
    adminVideosPending: "Beklemede",
    adminVideosApproved: "Onaylandı",
    adminVideosRejected: "Reddedildi",
    adminVideosSortBy: "Sırala",
    adminVideosUploadDate: "Yükleme Tarihi",
    adminVideosTitle: "Başlık",
    adminVideosUploader: "Yükleyici",
    adminVideosFlags: "Bayraklar",
    adminVideosOrder: "Sıralama",
    adminVideosNewestFirst: "En Yeni Önce",
    adminVideosOldestFirst: "En Eski Önce",
    adminVideosReview: "İncele",
    adminVideosReason: "Sebep",
    adminVideosViews: "görüntüleme",
    adminVideosLikes: "beğeni",
    adminVideosFlagsCount: "bayrak",
    adminVideosReviewVideo: "Videoyu İncele",
    adminVideosVideoInformation: "Video Bilgileri",
    adminVideosDuration: "Süre",
    adminVideosCategory: "Kategori",
    adminVideosUploadDate: "Yükleme Tarihi",
    adminVideosFlagsCount: "Bayraklar",
    adminVideosUploaderInformation: "Yükleyici Bilgileri",
    adminVideosDescription: "Açıklama",
    adminVideosTags: "Etiketler",
    adminVideosReject: "Reddet",
    adminVideosApprove: "Onayla",
    adminVideosEnterRejectionReason: "Reddetme sebebini girin:",
    adminVideosVideoPlayer: "Video Oynatıcı",
    adminVideosClickToPlay: "Oynatmak için tıklayın",
    
    // Admin Scheduler Management
    adminSchedulerPublicationScheduler: "Yayın Planlayıcısı",
    adminSchedulerScheduleVideoPublications: "Sosyal ağlarda video yayınlarını planlayın",
    adminSchedulerScheduleNewPost: "+ Yeni Gönderi Planla",
    adminSchedulerSearchFilters: "Arama ve Filtreler",
    adminSchedulerStatusFilter: "Durum Filtresi",
    adminSchedulerAllStatus: "Tüm Durumlar",
    adminSchedulerScheduled: "Planlandı",
    adminSchedulerPublished: "Yayınlandı",
    adminSchedulerFailed: "Başarısız",
    adminSchedulerCancelled: "İptal Edildi",
    adminSchedulerSocialNetwork: "Sosyal Ağ",
    adminSchedulerAllNetworks: "Tüm Ağlar",
    adminSchedulerDuration: "Süre",
    adminSchedulerCategory: "Kategori",
    adminSchedulerPublishesIn: "Yayınlanacak",
    adminSchedulerPublishNow: "Şimdi Yayınla",
    adminSchedulerCancel: "İptal",
    adminSchedulerScheduleNewPost: "Yeni Gönderi Planla",
    adminSchedulerSelectVideo: "Video Seçin *",
    adminSchedulerSelectSocialNetworks: "Sosyal Ağları Seçin *",
    adminSchedulerPublicationDate: "Yayın Tarihi *",
    adminSchedulerPublicationTime: "Yayın Saati *",
    adminSchedulerCustomMessage: "Özel Mesaj",
    adminSchedulerCustomMessageOptional: "Özel Mesaj (İsteğe Bağlı)",
    adminSchedulerCustomMessagePlaceholder: "Videonuza eşlik edecek özel bir mesaj ekleyin...",
    adminSchedulerCancel: "İptal",
    adminSchedulerSchedulePost: "Gönderi Planla",
    adminSchedulerScheduling: "Planlanıyor...",
    adminSchedulerPleaseSelectVideo: "Lütfen bir video seçin",
    adminSchedulerPleaseSelectNetwork: "Lütfen en az bir sosyal ağ seçin",
    adminSchedulerPleaseSelectDate: "Lütfen bir yayın tarihi seçin",
    adminSchedulerPleaseSelectTime: "Lütfen bir yayın saati seçin",
    adminSchedulerPostScheduledSuccessfully: "Gönderi başarıyla planlandı!",
    adminSchedulerFailedToSchedulePost: "Gönderi planlanamadı. Lütfen tekrar deneyin.",
    adminSchedulerErrorSchedulingPost: "Gönderi planlanırken hata. Lütfen tekrar deneyin.",
    adminSchedulerFailedToCancelPost: "Gönderi iptal edilemedi. Lütfen tekrar deneyin.",
    adminSchedulerErrorCancellingPost: "Gönderi iptal edilirken hata. Lütfen tekrar deneyin.",
    adminSchedulerFailedToPublishPost: "Gönderi yayınlanamadı. Lütfen tekrar deneyin.",
    adminSchedulerErrorPublishingPost: "Gönderi yayınlanırken hata. Lütfen tekrar deneyin.",
    adminSchedulerOverdue: "Gecikmiş",
    
    // Admin Payments Management
    adminPaymentsPaymentManagement: "Ödeme Yönetimi",
    adminPaymentsViewManageTransactions: "Ödeme işlemlerini görüntüleyin ve yönetin",
    adminPaymentsTransactions: "işlemler",
    adminPaymentsSearchFilters: "Arama ve Filtreler",
    adminPaymentsSearch: "Arama",
    adminPaymentsSearchPlaceholder: "İşlemleri ara...",
    adminPaymentsStatus: "Durum",
    adminPaymentsAllStatus: "Tüm Durumlar",
    adminPaymentsPending: "Beklemede",
    adminPaymentsCompleted: "Tamamlandı",
    adminPaymentsFailed: "Başarısız",
    adminPaymentsRefunded: "İade Edildi",
    adminPaymentsCancelled: "İptal Edildi",
    adminPaymentsType: "Tür",
    adminPaymentsAllTypes: "Tüm Türler",
    adminPaymentsSubscription: "Abonelik",
    adminPaymentsOneTime: "Tek Seferlik",
    adminPaymentsRefund: "İade",
    adminPaymentsUpgrade: "Yükseltme",
    adminPaymentsDateRange: "Tarih Aralığı",
    adminPaymentsAllTime: "Tüm Zaman",
    adminPaymentsToday: "Bugün",
    adminPaymentsThisWeek: "Bu Hafta",
    adminPaymentsThisMonth: "Bu Ay",
    adminPaymentsThisYear: "Bu Yıl",
    adminPaymentsTotalRevenue: "Toplam Gelir",
    adminPaymentsCompleted: "Tamamlandı",
    adminPaymentsPending: "Beklemede",
    adminPaymentsFailed: "Başarısız",
    adminPaymentsInvoice: "Fatura",
    adminPaymentsConfirm: "Onayla",
    adminPaymentsCancel: "İptal",
    adminPaymentsRefund: "İade",
    adminPaymentsView: "Görüntüle",
    adminPaymentsTransactionDetails: "İşlem Detayları",
    adminPaymentsTransactionInformation: "İşlem Bilgileri",
    adminPaymentsUserInformation: "Kullanıcı Bilgileri",
    adminPaymentsAdditionalInformation: "Ek Bilgiler",
    adminPaymentsPlan: "Plan",
    adminPaymentsBilling: "Faturalandırma",
    adminPaymentsDiscount: "İndirim",
    adminPaymentsTax: "Vergi",
    adminPaymentsCancelPayment: "Ödemeyi İptal Et",
    adminPaymentsRefund: "İade",
    adminPaymentsConfirmPayment: "Ödemeyi Onayla",
    adminPaymentsEnterCancellationReason: "İptal sebebini girin:",
    adminPaymentsEnterRefundReason: "İade sebebini girin:",
    adminPaymentsFailedToConfirmPayment: "Ödeme onaylanamadı. Lütfen tekrar deneyin.",
    adminPaymentsErrorConfirmingPayment: "Ödeme onaylanırken hata. Lütfen tekrar deneyin.",
    adminPaymentsRefundFunctionalityWouldBeImplemented: "İade işlevselliği burada uygulanacak",
    adminPaymentsErrorProcessingRefund: "İade işlenirken hata. Lütfen tekrar deneyin.",
    adminPaymentsFailedToCancelPayment: "Ödeme iptal edilemedi. Lütfen tekrar deneyin.",
    adminPaymentsErrorCancellingPayment: "Ödeme iptal edilirken hata. Lütfen tekrar deneyin.",
    
    // Admin Tickets Management
    adminTicketsSupportTickets: "Destek Biletleri",
    adminTicketsManageCustomerSupport: "Premium müşteriler için müşteri destek biletlerini yönetin",
    adminTicketsTickets: "bilet",
    adminTicketsSearchFilters: "Arama ve Filtreler",
    adminTicketsSearch: "Arama",
    adminTicketsSearchPlaceholder: "Biletleri ara...",
    adminTicketsStatus: "Durum",
    adminTicketsAllStatus: "Tüm Durumlar",
    adminTicketsOpen: "Açık",
    adminTicketsInProgress: "Devam Ediyor",
    adminTicketsResolved: "Çözüldü",
    adminTicketsClosed: "Kapalı",
    adminTicketsPriority: "Öncelik",
    adminTicketsAllPriority: "Tüm Öncelikler",
    adminTicketsUrgent: "Acil",
    adminTicketsHigh: "Yüksek",
    adminTicketsMedium: "Orta",
    adminTicketsLow: "Düşük",
    adminTicketsCategory: "Kategori",
    adminTicketsAllCategories: "Tüm Kategoriler",
    adminTicketsTechnical: "Teknik",
    adminTicketsBilling: "Faturalandırma",
    adminTicketsFeatureRequest: "Özellik Talebi",
    adminTicketsBugReport: "Hata Raporu",
    adminTicketsGeneral: "Genel",
    adminTicketsSubscription: "Abonelik",
    adminTicketsAllSubscriptions: "Tüm Abonelikler",
    adminTicketsPremium: "Premium",
    adminTicketsEnterprise: "Kurumsal",
    adminTicketsTotalTickets: "Toplam Bilet",
    adminTicketsOpen: "Açık",
    adminTicketsInProgress: "Devam Ediyor",
    adminTicketsResolved: "Çözüldü",
    adminTicketsUrgent: "Acil",
    adminTicketsView: "Görüntüle",
    adminTicketsAssignedTo: "Atanan",
    adminTicketsMessages: "mesaj",
    adminTicketsTicketInformation: "Bilet Bilgileri",
    adminTicketsUserInformation: "Kullanıcı Bilgileri",
    adminTicketsDescription: "Açıklama",
    adminTicketsConversation: "Konuşma",
    adminTicketsAssignToMe: "Bana Ata",
    adminTicketsTypeYourResponse: "Yanıtınızı yazın...",
    adminTicketsSend: "Gönder",
    adminTicketsFailedToSendMessage: "Mesaj gönderilemedi. Lütfen tekrar deneyin.",
    adminTicketsErrorSendingMessage: "Mesaj gönderilirken hata. Lütfen tekrar deneyin.",
    adminTicketsFailedToUpdateStatus: "Durum güncellenemedi. Lütfen tekrar deneyin.",
    adminTicketsErrorUpdatingStatus: "Durum güncellenirken hata. Lütfen tekrar deneyin.",
    adminTicketsFailedToAssignTicket: "Bilet atanamadı. Lütfen tekrar deneyin.",
    adminTicketsErrorAssigningTicket: "Bilet atanırken hata. Lütfen tekrar deneyin.",
    adminTicketsJustNow: "Az önce",
    adminTicketsHoursAgo: "saat önce",
    adminTicketsDaysAgo: "gün önce",

    // Admin Sidebar
    adminSidebarDashboard: "Kontrol Paneli",
    adminSidebarUsers: "Kullanıcılar",
    adminSidebarVideoModeration: "Video Moderasyonu",
    adminSidebarPublicationScheduler: "Yayın Planlayıcısı",
    adminSidebarPaymentManagement: "Ödeme Yönetimi",
    adminSidebarTicketSystem: "Bilet Sistemi",
    adminSidebarAdminPanel: "Admin Paneli",
    adminSidebarManagePlatform: "Platformunuzu ve analitiklerinizi yönetin",
    adminSidebarSignOut: "Çıkış Yap",

    // Admin Header
    adminHeaderDashboard: "Kontrol Paneli",
    adminHeaderUsers: "Kullanıcılar",
    adminHeaderVideoModeration: "Video Moderasyonu",
    adminHeaderPublicationScheduler: "Yayın Planlayıcısı",
    adminHeaderPaymentManagement: "Ödeme Yönetimi",
    adminHeaderTicketSystem: "Bilet Sistemi",
    adminHeaderAdminPanel: "Admin Paneli",
    adminHeaderManagePlatform: "Platformunuzu ve analitiklerinizi yönetin",
    adminHeaderSearch: "Ara",
    adminHeaderSearchPlaceholder: "Ara...",
    adminHeaderNotifications: "Bildirimler",
    adminHeaderNewUserRegistered: "Yeni kullanıcı kayıtlı",
    adminHeaderVideoProcessingCompleted: "Video işleme tamamlandı",
    adminHeaderSystemBackupCompleted: "Sistem yedekleme tamamlandı",
    adminHeaderMinutesAgo: "dakika önce",
    adminHeaderHourAgo: "saat önce",
    adminHeaderAdminUser: "Admin Kullanıcı",
  },
  
  ar: {
    // Navigation
    home: "الرئيسية",
    studio: "الاستوديو",
    pricing: "الأسعار",
    about: "حولنا",
    contact: "اتصل بنا",
    referrals: "الإحالات",
    
    // Hero Section
    heroTitle: "أنشئ فيديوهات أفاتار ذكية مميزة في أقل من 5 دقائق.",
    heroSubtitle: "للمقاهي والمطاعم والمتاجر والمبدعين. أنيق، مستقبلي، بسيط.",
    getStarted: "ابدأ الآن",
    seePricing: "انظر الأسعار",
    
    // Trust indicators
    noCreditCard: "لا حاجة لبطاقة ائتمان",
    fiveMinuteSetup: "إعداد في 5 دقائق",
    hdQuality: "فيديوهات عالية الجودة",
    
    // How it works
    howItWorks: "كيف يعمل",
    howItWorksSubtitle: "أنشئ فيديوهات تسويقية احترافية في 4 خطوات بسيطة فقط",
    step1Title: "اكتب السيناريو",
    step1Description: "اكتب سيناريو قصير أو الصق عرض منتجك. ذكاؤنا الاصطناعي سيقوم بتحسينه للفيديو.",
    step2Title: "اختر الأفاتار والخلفيات",
    step2Description: "اختر أفاتار وحدد 2-4 خلفيات تطابق علامتك التجارية ورسالتك.",
    step3Title: "أضف العناصر البصرية",
    step3Description: "أضف صور المنتجات أو الأجهزة أو الطعام للحظات بصرية تجذب جمهورك.",
    step4Title: "صدّر وشارك",
    step4Description: "صدّر فيديو مع تراكب شعار خفيف ومعلومات الاتصال الخاصة بك جاهزة للمشاركة.",
    
    // Preview Section
    seeItInAction: "شاهدها في العمل",
    previewSubtitle: "شاهد مدى سهولة إنشاء فيديوهات تسويقية احترافية",
    lightningFast: "سريع كالبرق",
    lightningFastDesc: "توليد في أقل من 5 دقائق",
    hdQualityTitle: "جودة عالية",
    hdQualityDesc: "فيديوهات 4K احترافية",
    autoPublishing: "نشر تلقائي",
    autoPublishingDesc: "مباشرة إلى وسائل التواصل الاجتماعي",
    
    // Pricing Section
    simplePricing: "أسعار بسيطة",
    pricingSubtitle: "خطط بسيطة للمبدعين والشركات. انظر التفاصيل الكاملة في صفحة الأسعار.",
    seePricingButton: "انظر الأسعار",
    startNow: "ابدأ الآن",
    
    // Account Menu
    account: "الحساب",
    dashboard: "لوحة التحكم",
    profile: "الملف الشخصي",
    myVideos: "فيديوهاتي",
    subscription: "الاشتراك",
    settings: "الإعدادات",
    adminPanel: "لوحة الإدارة",
    signOut: "تسجيل الخروج",
    
    // Footer
    footerTitle: "مستعد لإنشاء فيديوهات مذهلة؟",
    footerSubtitle: "انضم إلى آلاف المبدعين الذين يستخدمون MarketUp",
    footerGetStarted: "ابدأ الآن",
    footerFollowUs: "تابعنا:",
    footerInstagram: "إنستغرام",
    footerFacebook: "فيسبوك",
    footerTikTok: "تيك توك",
    footerCopyright: "©️ 2026 MarketUp. جميع الحقوق محفوظة.",
    footerContact: "اتصل بنا:",
    footerPrivacy: "الخصوصية",
    footerTerms: "الشروط",
    footerCookies: "ملفات تعريف الارتباط",
    
    // Studio Page
    studioAccessDenied: "الوصول مرفوض",
    studioSignInRequired: "يرجى تسجيل الدخول لإنشاء الفيديوهات",
    studioSignIn: "تسجيل الدخول",
    studioStep: "خطوة",
    studioOf: "من",
    studioChooseAvatar: "اختر الأفاتار",
    studioSelectPresenter: "اختر مقدمك الافتراضي",
    studioLanguageVoice: "اللغة والصوت",
    studioPickLanguage: "اختر اللغة والصوت",
    studioBackgrounds: "الخلفيات",
    studioChooseScenes: "اختر عدة مشاهد",
    studioScript: "النص",
    studioWriteMessage: "اكتب رسالتك",
    studioGenerate: "إنشاء",
    studioCreateVideo: "أنشئ فيديوك",
    studioPreview: "معاينة",
    studioReviewDownload: "راجع وحمل",
    
    // Onboarding Page
    onboardingWelcome: "مرحباً بك في MarketUp",
    onboardingGetStarted: "دعنا نبدأ",
    onboardingSetupTime: "سنساعدك في إعداد حسابك في خطوات بسيطة فقط. سيستغرق هذا دقيقتين فقط.",
    onboardingPersonalize: "تخصيص",
    onboardingPersonalizeDesc: "اختر بلدك وتفضيلات اللغة",
    onboardingConfigure: "تكوين",
    onboardingConfigureDesc: "قم بإعداد تفضيلات إنشاء الفيديو",
    onboardingCreate: "إنشاء",
    onboardingCreateDesc: "ابدأ في إنشاء فيديوهات ذكية مذهلة",
    onboardingStep: "خطوة",
    onboardingOf: "من",
    onboardingWhereLocated: "أين تقع؟",
    onboardingLocationDesc: "هذا يساعدنا في تقديم محتوى وميزات ذات صلة بمنطقتك.",
    onboardingWhatLanguage: "ما هي لغتك؟",
    onboardingLanguageDesc: "اختر لغتك المفضلة للواجهة والمحتوى.",
    onboardingBack: "رجوع",
    onboardingContinue: "متابعة",
    onboardingSkip: "تخطي الآن",
    onboardingCompleteSetup: "إكمال الإعداد",
    onboardingSettingUp: "جاري الإعداد...",
    onboardingError: "لا يمكن حفظ التفضيلات. يرجى المحاولة مرة أخرى.",
    
    // Referrals Page
    referralsCreateCode: "أنشئ رمز الإحالة الخاص بك",
    referralsGenerateLink: "أنشئ رابطك الفريد",
    referralsYourUserId: "معرف المستخدم الخاص بك",
    referralsUserIdPlaceholder: "مثل، usr_123",
    referralsGenerating: "جاري الإنشاء…",
    referralsGenerate: "إنشاء",
    referralsCodeReady: "رمز الإحالة الخاص بك جاهز!",
    referralsYourCode: "رمزك",
    referralsCopyLink: "نسخ الرابط",
    referralsShareLink: "شارك هذا الرابط:",
    referralsRedeemCode: "استخدم رمز",
    referralsEnterCode: "أدخل رمز الإحالة",
    referralsCode: "الرمز",
    referralsCodePlaceholder: "أدخل رمز الإحالة",
    referralsRedeeming: "جاري الاستخدام…",
    referralsRedeem: "استخدم",
    referralsSuccess: "نجح — مرحباً!",
    referralsWelcome: "نجح — مرحباً!",
    referralsInvalidCode: "رمز غير صحيح",
    referralsNetworkError: "خطأ في الشبكة",
    referralsProvideUserId: "أدخل معرف المستخدم الخاص بك.",
    referralsEnterCodeToRedeem: "أدخل رمزاً للاستخدام.",
    referralsHowReferralsWork: "كيف تعمل الإحالات",
    referralsStartEarning: "ابدأ الكسب",
    referralsGenerateStep: "إنشاء",
    referralsGenerateDesc: "أنشئ رمزك الشخصي بنقرة واحدة.",
    referralsShareStep: "مشاركة",
    referralsShareDesc: "أرسل رابطك للأصدقاء أو العملاء.",
    referralsEarnStep: "كسب",
    referralsEarnDesc: "احصل على مكافآت عند اشتراكهم.",
    referralsStep: "خطوة",
    
    // Contact Page
    contactHearFromYou: "نسمع منك",
    contactQuestionsPartnerships: "الأسئلة، الشراكات أو الصحافة — أرسل لنا رسالة وسنرد قريباً.",
    contactResponseTime: "نرد عادة خلال 24 ساعة.",
    contact24hResponse: "وقت الاستجابة 24 ساعة",
    contactExpertSupport: "دعم الخبراء",
    contactNoSpam: "لا بريد مزعج أبداً",
    contactGetInTouch: "تواصل معنا",
    contactSendMessage: "أرسل لنا رسالة وسنعود إليك خلال 24 ساعة",
    contactThanksMessage: "شكراً! تم إرسال رسالتك.",
    contactResponseTimeDesc: "نرد عادة خلال 24 ساعة.",
    contactSendAnother: "أرسل أخرى",
    contactName: "الاسم",
    contactNamePlaceholder: "اسمك",
    contactEmail: "البريد الإلكتروني",
    contactEmailPlaceholder: "أنت@الشركة.ae",
    contactMessage: "الرسالة",
    contactMessagePlaceholder: "كيف يمكننا المساعدة؟",
    contactNoBotsSpam: "لا روبوتات، لا بريد مزعج. سنستخدم بريدك الإلكتروني للرد فقط.",
    contactFillAllFields: "يرجى ملء جميع الحقول.",
    contactValidEmail: "أدخل عنوان بريد إلكتروني صحيح.",
    contactMessageLength: "يجب أن تكون الرسالة 10 أحرف على الأقل.",
    contactSending: "جاري الإرسال...",
    contactSendMessage: "إرسال الرسالة",
    contactClear: "مسح",
    contactSomethingWrong: "حدث خطأ ما. يرجى المحاولة مرة أخرى.",
    contactOtherWays: "طرق أخرى للوصول إلينا",
    contactBusinessHours: "ساعات العمل",
    contactBusinessHoursDesc: "الاثنين-الجمعة، 9:00-18:00 EST",
    contactResponseTimeLabel: "وقت الاستجابة",
    contactResponseTimeValue: "خلال 24 ساعة",
    contactEmailSupport: "دعم البريد الإلكتروني",
    contactGetHelpEmail: "احصل على المساعدة عبر البريد الإلكتروني",
    contactOnlineNow: "متصل الآن",
    contactEmailDescription: "أرسل لنا بريداً إلكترونياً وسنعود إليك خلال 24 ساعة. مثالي للأسئلة التفصيلية، التعليقات أو طلبات الدعم.",
    contactEmailButton: "support@marketup.app",
    contactEmailSupportMobile: "دعم البريد الإلكتروني",
    contact24hResponseLabel: "رد 24 ساعة",
    contactExpertSupportLabel: "دعم الخبراء",
    contactWhatsAppSupport: "دعم واتساب",
    contactComingSoon: "قريباً",
    contactInDevelopment: "قيد التطوير",
    contactWhatsAppDescription: "سيكون دعم واتساب متاحاً قريباً للمراسلة الفورية والأسئلة السريعة.",
    contactWhatsAppButton: "واتساب (قريباً)",
    contactWhatsAppMobile: "واتساب",
    contactInstantChat: "محادثة فورية",
    contactFrequentlyAsked: "الأسئلة الشائعة",
    contactQuestions: "الأسئلة",
    contactQuickAnswers: "إجابات سريعة للأسئلة الشائعة حول",
    contactAIVideoPlatform: "منصة الفيديو الذكية",
    contactHowLong: "كم من الوقت يستغرق؟",
    contactHowLongDesc: "ذكاؤنا الاصطناعي ينتج فيديوهات تسويقية احترافية في أقل من 5 دقائق. اكتب سيناريوك، اختر الصورة الرمزية والخلفيات، أضف العناصر البصرية وصدر فيديو عالي الدقة جاهز للمشاركة.",
    contactUnder5Minutes: "أقل من 5 دقائق",
    contactHDQuality: "جودة عالية الدقة",
    contactVideoQuality: "جودة الفيديو؟",
    contactVideoQualityDesc: "ننتج فيديوهات عالية الجودة (1080p) مع صور رمزية ذكية احترافية. جميع الفيديوهات محسنة لمنصات وسائل التواصل الاجتماعي وقابلة للتحميل بصيغ متعددة.",
    contact1080pHD: "1080p عالي الدقة",
    contactMultipleFormats: "صيغ متعددة",
    contactCustomVoice: "صوت مخصص؟",
    contactCustomVoiceDesc: "نستخدم حالياً أصواتاً ذكية اصطناعية تبدو طبيعية ومهنية. ميزات استنساخ الصوت قريباً للفيديوهات الشخصية بصوتك الخاص.",
    contactComingSoonLabel: "قريباً",
    contactAIVoicesNow: "أصوات ذكية الآن",
    contactCommercialUse: "الاستخدام التجاري؟",
    contactCommercialUseDesc: "نعم! جميع الخطط تشمل حقوق الاستخدام التجاري. استخدم الفيديوهات المنتجة للتسويق، الإعلان، وسائل التواصل الاجتماعي وأي أغراض تجارية دون رسوم ترخيص إضافية.",
    contactCommercialRights: "حقوق تجارية",
    contactNoExtraFees: "لا رسوم إضافية",
    
    // Pricing Page
    pricingTransparentPricing: "تسعير شفاف",
    pricingSimpleTransparent: "تسعير بسيط وشفاف",
    pricingChoosePerfectPlan: "اختر الخطة المثالية لاحتياجات إنشاء الفيديوهات الذكية.",
    pricingNoHiddenFees: "لا رسوم مخفية، ألغ في أي وقت.",
    pricingMonthly: "شهرياً",
    pricingYearly: "سنوياً",
    pricingSave20: "وفر 20%",
    pricingFree: "مجاني",
    pricingPro: "احترافي",
    pricingEnterprise: "مؤسسي",
    pricingPerfectForGettingStarted: "مثالي للبدء",
    pricingBestForProfessionals: "الأفضل للمحترفين والمبدعين",
    pricingForTeamsOrganizations: "للفرق والمنظمات الكبيرة",
    pricingMostPopular: "الأكثر شعبية",
    pricingEnterpriseBadge: "مؤسسي",
    pricingGetStartedFree: "ابدأ مجاناً",
    pricingStartProTrial: "ابدأ التجربة الاحترافية",
    pricingContactSales: "تواصل مع المبيعات",
    pricing3VideosPerMonth: "3 فيديوهات شهرياً",
    pricingStandardQuality720p: "جودة قياسية (720p)",
    pricingBasicAvatars: "أفاتار أساسية",
    pricing5Languages: "5 لغات",
    pricingCommunitySupport: "دعم المجتمع",
    pricingWatermarkOnVideos: "علامة مائية على الفيديوهات",
    pricing50VideosPerMonth: "50 فيديو شهرياً",
    pricingHDQuality1080p: "جودة عالية الدقة (1080p)",
    pricingAllAvatarsVoices: "جميع الأفاتار والأصوات",
    pricing20PlusLanguages: "20+ لغة",
    pricingPrioritySupport: "دعم أولوي",
    pricingNoWatermark: "بدون علامة مائية",
    pricingCustomBackgrounds: "خلفيات مخصصة",
    pricingAdvancedEditingTools: "أدوات تحرير متقدمة",
    pricingAPIAccess: "وصول API",
    pricingUnlimitedVideos: "فيديوهات غير محدودة",
    pricing4KQuality2160p: "جودة 4K (2160p)",
    pricingCustomAvatars: "أفاتار مخصصة",
    pricingAllLanguagesVoices: "جميع اللغات والأصوات",
    pricingDedicatedSupport: "دعم مخصص",
    pricingCustomBranding: "علامة تجارية مخصصة",
    pricingTeamCollaboration: "تعاون الفريق",
    pricingAdvancedAnalytics: "تحليلات متقدمة",
    pricingWhiteLabelSolution: "حل White-label",
    pricingCustomIntegrations: "تكاملات مخصصة",
    pricingSLAGuarantee: "ضمان SLA",
    pricingFeatureComparison: "مقارنة الميزات",
    pricingCompareAllFeatures: "قارن جميع الميزات",
    pricingEverythingYouNeed: "كل ما تحتاجه لاختيار الخطة المناسبة",
    pricingFeatures: "الميزات",
    pricingVideoCreation: "إنشاء الفيديو",
    pricingAvatarsVoices: "الأفاتار والأصوات",
    pricingSupport: "الدعم",
    pricingVideosPerMonth: "فيديوهات شهرياً",
    pricingVideoQuality: "جودة الفيديو",
    pricingVideoDuration: "مدة الفيديو",
    pricingExportFormats: "تنسيقات التصدير",
    pricingAvailableAvatars: "الأفاتار المتاحة",
    pricingVoiceOptions: "خيارات الصوت",
    pricingVoiceQuality: "جودة الصوت",
    pricingCustomVoices: "أصوات مخصصة",
    pricingBackgroundOptions: "خيارات الخلفية",
    pricingEmailSupport: "دعم البريد الإلكتروني",
    pricingFrequentlyAsked: "الأسئلة الشائعة",
    pricingQuestions: "الأسئلة",
    pricingEverythingYouNeedToKnow: "كل ما تحتاج معرفته عن تسعيرنا",
    pricingCanChangePlanAnytime: "هل يمكنني تغيير خطتي في أي وقت؟",
    pricingCanChangePlanAnytimeAnswer: "نعم، يمكنك ترقية أو تخفيض خطتك في أي وقت. التغييرات سارية فوراً، وسنحسب أي اختلافات في الفوترة بشكل متناسب.",
    pricingWhatHappensToVideos: "ماذا يحدث لفيديوهاتي إذا خفضت خطتي؟",
    pricingWhatHappensToVideosAnswer: "فيديوهاتك الموجودة تبقى متاحة. ستحصل فقط على حدود مخفضة لإنشاء فيديوهات جديدة بناءً على خطتك الجديدة.",
    pricingDoYouOfferRefunds: "هل تقدمون استرداد الأموال؟",
    pricingDoYouOfferRefundsAnswer: "نقدم ضمان استرداد الأموال لمدة 30 يوماً لجميع الخطط المدفوعة. تواصل مع فريق الدعم إذا لم تكن راضياً.",
    pricingCanCancelSubscription: "هل يمكنني إلغاء اشتراكي؟",
    pricingCanCancelSubscriptionAnswer: "نعم، يمكنك الإلغاء في أي وقت من إعدادات حسابك. اشتراكك سيبقى نشطاً حتى نهاية فترة فوترتك.",
    pricingCustomEnterpriseSolutions: "هل تقدمون حلول مؤسسية مخصصة؟",
    pricingCustomEnterpriseSolutionsAnswer: "بالطبع! تواصل مع فريق المبيعات لمناقشة التسعير المخصص والميزات والتكاملات لمنظمتك.",
    pricingGetStarted: "ابدأ",
    pricingReadyToCreate: "مستعد لإنشاء فيديوهات ذكية مذهلة؟",
    pricingJoinThousands: "انضم إلى آلاف المبدعين والشركات الذين يستخدمون بالفعل منصتنا لإنشاء فيديوهات أفاتار ذكية احترافية.",
    pricingStartFreeTrial: "ابدأ التجربة المجانية",
    pricingContactSales: "تواصل مع المبيعات",
    pricingSavePerYear: "وفر $/سنة",
    pricingForever: "للأبد",
    pricingMonth: "شهر",
    pricingYear: "سنة",
    
    // Studio Wizard Components
    studioChooseAvatar: "اختر الصورة الرمزية",
    studioSelectPresenter: "اختر المقدم",
    studioLanguageVoice: "اللغة والصوت",
    studioPickLanguage: "اختر اللغة",
    studioBackgrounds: "الخلفيات",
    studioChooseScenes: "اختر المشاهد",
    studioScript: "النص",
    studioWriteMessage: "اكتب الرسالة",
    studioGenerate: "إنشاء",
    studioCreateVideo: "إنشاء فيديو",
    studioPreview: "معاينة",
    studioReviewDownload: "مراجعة وتحميل",
    studioStep: "خطوة",
    studioOf: "من",
    studioAccessDenied: "تم رفض الوصول",
    studioSignInRequired: "يرجى تسجيل الدخول للوصول إلى الاستوديو",
    studioSignIn: "تسجيل الدخول",
    
    // Avatar Step
    studioChooseYourAvatar: "اختر صورتك الرمزية",
    studioSelectVirtualPresenter: "اختر المقدم الافتراضي الذي سيقدم رسالتك.",
    studioEachAvatarUnique: "كل صورة رمزية لها شخصية فريدة وأسلوب كلام مميز.",
    studioPreview: "معاينة",
    studioWillPresentVideo: "سيقدم فيديوك",
    studioContinue: "متابعة",
    
    // Language Step
    studioLanguageVoice: "اللغة والصوت",
    studioChooseLanguageVoice: "اختر اللغة والصوت لفيديوك.",
    studioPreviewEachVoice: "يمكنك معاينة كل صوت قبل الاختيار.",
    studioSelectLanguage: "اختر اللغة",
    studioChooseVoice: "اختر الصوت",
    studioAllTones: "جميع النغمات",
    studioProfessional: "مهني",
    studioEnergetic: "نشيط",
    studioCalm: "هادئ",
    studioExpressive: "معبر",
    studioPlaying: "جاري التشغيل...",
    studioPreview: "معاينة",
    studioSelectedVoice: "الصوت المحدد",
    studioBack: "رجوع",
    studioContinue: "متابعة",
    
    // Background Step
    studioChooseBackgrounds: "اختر الخلفيات",
    studioSelectMultipleBackgrounds: "اختر عدة خلفيات لفيديوك.",
    studioChoose2To4Scenes: "يمكنك اختيار 2-4 مشاهد مختلفة لإنشاء انتقالات ديناميكية.",
    studioAll: "الكل",
    studioProfessional: "مهني",
    studioCasual: "عادي",
    studioCreative: "إبداعي",
    studioBackgroundsSelected: "خلفية محددة",
    studioPreview: "معاينة",
    studioPreviewMode: "وضع المعاينة",
    studioExitPreview: "خروج من المعاينة",
    studioSelectedBackgrounds: "الخلفيات المحددة",
    studioMoreBackgrounds: "خلفيات أكثر",
    studioBack: "رجوع",
    studioContinue: "متابعة",
    
    // Text Step
    studioWriteYourScript: "اكتب نصك",
    studioWriteTextAvatarSpeak: "اكتب النص الذي ستتحدث به صورتك الرمزية.",
    studioStartWithTemplate: "يمكنك البدء بقالب أو كتابة المحتوى الخاص بك.",
    studioQuickTemplates: "قوالب سريعة",
    studioWelcomeMessage: "رسالة ترحيب",
    studioProductIntroduction: "تقديم المنتج",
    studioTrainingIntroduction: "مقدمة التدريب",
    studioCompanyAnnouncement: "إعلان الشركة",
    studioTutorialIntroduction: "مقدمة البرنامج التعليمي",
    studioSpecialOffer: "عرض خاص",
    studioBusiness: "أعمال",
    studioMarketing: "تسويق",
    studioEducation: "تعليم",
    studioYourScript: "نصك",
    studioWords: "كلمة",
    studioCharacters: "حرف",
    studioDuration: "المدة",
    studioShort: "قصير",
    studioMedium: "متوسط",
    studioLong: "طويل",
    studioWriteScriptHere: "اكتب نصك هنا... ستتحدث صورتك الرمزية بهذا النص بشكل طبيعي.",
    studioWritingTips: "نصائح الكتابة",
    studioNaturalSpeech: "كلام طبيعي",
    studioWriteAsYouSpeak: "اكتب كما تتحدث طبيعياً، مع التوقفات والتأكيدات.",
    studioOptimalLength: "الطول الأمثل",
    studioKeepVideos30To120: "احتفظ بالفيديوهات بين 30-120 ثانية للحصول على أفضل تفاعل.",
    studioClearStructure: "هيكل واضح",
    studioStartWithHook: "ابدأ بخطاف، ابلغ رسالتك، واختتم بدعوة للعمل.",
    studioPronunciation: "النطق",
    studioUsePhoneticSpelling: "استخدم الكتابة الصوتية للكلمات الصعبة: \"AI\" كـ \"A-I\".",
    studioPreview: "معاينة",
    studioBack: "رجوع",
    studioContinue: "متابعة",
    
    // Generation Step
    studioGenerateYourVideo: "أنشئ فيديوك",
    studioCreatePersonalizedVideo: "سنقوم بإنشاء فيديو مخصص لك باستخدام الذكاء الاصطناعي.",
    studioProcessTakes2To3Minutes: "هذه العملية تستغرق عادة 2-3 دقائق.",
    studioVideoSummary: "ملخص الفيديو",
    studioAvatar: "الصورة الرمزية",
    studioBackground: "الخلفية",
    studioDuration: "المدة",
    studioWords: "كلمة",
    studioGeneratingYourVideo: "جاري إنشاء فيديوك",
    studioDontCloseWindow: "يرجى عدم إغلاق هذه النافذة أثناء إنشاء فيديوك.",
    studioProgress: "التقدم",
    studioPreparingAssets: "تحضير الأصول",
    studioGeneratingAvatarAnimation: "إنشاء رسوم متحركة للصورة الرمزية",
    studioSynthesizingVoice: "تركيب الصوت",
    studioProcessingBackground: "معالجة الخلفية",
    studioCompositingVideo: "تركيب الفيديو",
    studioFinalizingOutput: "إنهاء المخرجات",
    studioComplete: "مكتمل",
    studioProcessing: "جاري المعالجة...",
    studioEstimatedTimeRemaining: "الوقت المتبقي المقدر:",
    studioCancelGeneration: "إلغاء الإنشاء",
    studioReadyToGenerate: "جاهز للإنشاء",
    studioVideoCreatedWithSettings: "سيتم إنشاء فيديوك بالإعدادات أعلاه.",
    studioStartGeneration: "بدء الإنشاء",
    studioBack: "رجوع",
    studioGenerationTakes2To3Minutes: "الإنشاء يستغرق عادة 2-3 دقائق",
    
    // Preview Step
    studioYourVideoReady: "فيديوك جاهز!",
    studioReviewGeneratedVideo: "راجع الفيديو المنشأ وقم بتحميله عندما تكون راضياً عن النتيجة.",
    studioDownloadWhenSatisfied: "قم بالتحميل عندما تكون راضياً عن النتيجة.",
    studioPlaying: "جاري التشغيل...",
    studioClickToPreview: "انقر للمعاينة",
    studioDuration: "المدة",
    studioQuality: "الجودة",
    studioFormat: "التنسيق",
    studioFileSize: "حجم الملف",
    studioVideoSettings: "إعدادات الفيديو",
    studioVoice: "الصوت",
    studioBackground: "الخلفية",
    studioResolution: "الدقة",
    studioScriptLength: "طول النص",
    studioScript: "النص",
    studioActions: "الإجراءات",
    studioDownloading: "جاري التحميل...",
    studioDownloadVideo: "تحميل الفيديو",
    studioRegenerate: "إعادة إنشاء",
    studioSaveContinue: "حفظ ومتابعة",
    studioDownloadProgress: "تقدم التحميل",
    studioBack: "رجوع",
    studioVideoGeneratedSuccessfully: "تم إنشاء الفيديو بنجاح",
    
    // About Page
    aboutTitle: "حول MarketUp",
    aboutWelcome: "مرحباً بكم في MarketUp، منصة أوروبية مصممة لمساعدة الجميع — من أصحاب المتاجر الصغيرة والمقاهي إلى الشركات الكبيرة — في الترويج لأعمالهم",
    aboutEasilyAffordably: "بسهولة وبأسعار معقولة.",
    aboutEuropeanPlatform: "منصة أوروبية",
    aboutForEveryone: "للجميع",
    aboutEasyAffordable: "سهل وبأسعار معقولة",
    aboutOurMissionVision: "مهمتنا ورؤيتنا",
    aboutDrivingInnovation: "نقود الابتكار في تكنولوجيا التسويق لـ",
    aboutEveryone: "الجميع",
    aboutOurMission: "مهمتنا",
    aboutMissionText: "مهمتنا هي تمكين الأفراد والشركات من الترويج لمنتجاتهم أو خدماتهم دون الحاجة إلى وكالات إعلانية باهظة الثمن — فقط تسويق بسيط وذكي وفعال.",
    aboutOurVision: "رؤيتنا",
    aboutVisionText: "رؤيتنا للمستقبل هي توسيع MarketUp بطرق جديدة ومبتكرة تجعل التسويق أسهل وأقوى لجميع المستخدمين.",
    aboutWhatMakesDifferent: "ما يجعلنا مختلفين",
    aboutDifferentText: "ما يجعلنا مختلفين هو تركيزنا على",
    aboutSimplicityQualityAccessibility: "البساطة والجودة وإمكانية الوصول.",
    aboutWhatMarketUpOffers: "ما تقدمه MarketUp",
    aboutComprehensiveSolutions: "حلول شاملة لجميع",
    aboutMarketingNeeds: "احتياجاتك التسويقية",
    aboutSmartAIVideo: "إنشاء فيديو ذكي مدعوم بالذكاء الاصطناعي",
    aboutForMarketing: "للتسويق",
    aboutAffordablePricing: "خطط تسعير ميسورة التكلفة",
    aboutSuitableForAll: "مناسبة لجميع المستخدمين",
    aboutMultilingualSupport: "فريق دعم متعدد اللغات",
    aboutLanguages: "الإنجليزية والعربية والسويدية والتركية",
    aboutEasyToUse: "أدوات سهلة الاستخدام",
    aboutMakeVideoMarketing: "التي تجعل تسويق الفيديو أسرع وأكثر إبداعاً وفي متناول الجميع",
    aboutActive: "نشط",
    aboutOurCommitment: "التزامنا",
    aboutCommitmentText: "نهدف إلى تقديم دعم مستمر وأدوات أذكى وحلول إبداعية لتقديم أفضل تجربة ممكنة لكل عميل.",
    aboutQuote: "MarketUp – حيث تصبح أفكارك قوة تسويقية",
    aboutOurSlogans: "شعاراتنا",
    aboutSlogan: "الشعار",
    aboutSloganText: "MarketUp – عملك يستحق أن يُرى",
    aboutTagline: "الشعار",
    aboutTaglineText: "قصتك وتقنيتنا – رؤية واحدة للنجاح",
    aboutReadyToTransform: "مستعد لتحويل",
    aboutMarketing: "تسويقك؟",
    aboutJoinThousands: "انضم إلى آلاف الشركات التي تستخدم بالفعل MarketUp لإنشاء فيديوهات تسويقية احترافية.",
    aboutGetStarted: "ابدأ",
    aboutSeePricing: "شاهد الأسعار",
    
    // Dashboard Page
    dashboardWelcomeBack: "مرحباً بعودتك،",
    dashboardCreator: "المبدع!",
    dashboardTotalVideos: "إجمالي الفيديوهات",
    dashboardThisMonth: "هذا الشهر",
    dashboardCurrentPlan: "الخطة الحالية",
    dashboardFreePlan: "الخطة المجانية",
    dashboardUpgradeToPro: "ترقية إلى Pro",
    dashboardStorageUsed: "المساحة المستخدمة",
    dashboardOfUsed: "من",
    dashboardCompleted: "مكتملة",
    dashboardReadyToView: "جاهزة للمشاهدة",
    dashboardProcessing: "قيد المعالجة",
    dashboardInProgress: "جاري العمل",
    dashboardTotalViews: "إجمالي المشاهدات",
    dashboardAllTime: "طوال الوقت",
    dashboardDownloads: "التحميلات",
    dashboardQuickActions: "الإجراءات السريعة",
    dashboardCreateVideo: "إنشاء فيديو",
    dashboardStartNewProject: "بدء مشروع فيديو جديد",
    dashboardMyVideos: "فيديوهاتي",
    dashboardViewAllVideos: "عرض جميع فيديوهاتك",
    dashboardUpgradePlan: "ترقية الخطة",
    dashboardManageSubscription: "إدارة اشتراكك",
    dashboardSettings: "الإعدادات",
    dashboardAccountPreferences: "تفضيلات الحساب",
    dashboardRecentVideos: "الفيديوهات الأخيرة",
    dashboardViewAll: "عرض الكل ←",
    dashboardViews: "مشاهدة",
    dashboardNoVideosYet: "لا توجد فيديوهات بعد",
    dashboardCreateFirstVideo: "أنشئ أول فيديو لك للبدء",
    
    // Profile Page
    profileAnonymousUser: "مستخدم مجهول",
    profileNotSet: "غير محدد",
    profileCancel: "إلغاء",
    profileEditProfile: "تعديل الملف الشخصي",
    profilePersonalInformation: "المعلومات الشخصية",
    profileFullName: "الاسم الكامل",
    profileEnterFullName: "أدخل اسمك الكامل",
    profileEmailAddress: "عنوان البريد الإلكتروني",
    profileEnterEmail: "أدخل بريدك الإلكتروني",
    profileEmailCannotBeChanged: "لا يمكن تغيير البريد الإلكتروني",
    profileBio: "السيرة الذاتية",
    profileTellAboutYourself: "أخبرنا عن نفسك...",
    profileCountry: "البلد",
    profileSelectCountry: "اختر بلدك",
    profileLanguage: "اللغة",
    profileSelectLanguage: "اختر لغتك",
    profileCompany: "الشركة",
    profileCompanyName: "اسم شركتك",
    profileWebsite: "الموقع الإلكتروني",
    profileWebsiteUrl: "https://موقعك.com",
    profileSaving: "جاري الحفظ...",
    profileSaveChanges: "حفظ التغييرات",
    profileProfileStats: "إحصائيات الملف الشخصي",
    profileProfileCompletion: "اكتمال الملف الشخصي",
    profileVideos: "الفيديوهات",
    profileProjects: "المشاريع",
    profileAccountSettings: "إعدادات الحساب",
    profileChangePassword: "تغيير كلمة المرور",
    profileUpdatePassword: "تحديث كلمة المرور",
    profileTwoFactorAuth: "المصادقة الثنائية",
    profileAddExtraSecurity: "إضافة أمان إضافي",
    profileDeleteAccount: "حذف الحساب",
    profilePermanentlyDeleteAccount: "حذف الحساب نهائياً",
    
    // Videos Page
    videosMyVideos: "فيديوهاتي",
    videosManageViewAll: "إدارة وعرض جميع الفيديوهات التي أنشأتها",
    videosCreateNewVideo: "إنشاء فيديو جديد",
    videosSearchVideos: "البحث في الفيديوهات...",
    videosAll: "الكل",
    videosCompleted: "مكتملة",
    videosProcessing: "قيد المعالجة",
    videosQueued: "في الطابور",
    videosLoadingVideos: "جاري تحميل الفيديوهات...",
    videosStatus: "الحالة",
    videosDuration: "المدة",
    videosViews: "المشاهدات",
    videosDownloads: "التحميلات",
    videosView: "عرض",
    videosEdit: "تعديل",
    videosDownload: "تحميل",
    videosShare: "مشاركة",
    videosDuplicate: "نسخ",
    videosDelete: "حذف",
    videosProcessingStatus: "قيد المعالجة...",
    videosNoVideosFound: "لم يتم العثور على فيديوهات",
    videosTryAdjustingSearch: "حاول تعديل مصطلحات البحث",
    videosCreateFirstVideo: "أنشئ أول فيديو لك للبدء",
    videosCreateVideo: "إنشاء فيديو",
    videosPage: "صفحة",
    videosOf: "من",
    videosPrevious: "السابق",
    videosPrev: "السابق",
    videosNext: "التالي",
    videosDownloadFunctionalityComingSoon: "وظيفة التحميل قريباً!",
    videosShareFunctionalityComingSoon: "وظيفة المشاركة قريباً!",
    videosDeleteFunctionalityComingSoon: "وظيفة الحذف قريباً!",
    videosDuplicateFunctionalityComingSoon: "وظيفة النسخ قريباً!",
    videosAreYouSureDelete: "هل أنت متأكد من أنك تريد حذف هذا الفيديو؟",
    
    // Subscription Page
    subscriptionManagement: "إدارة الاشتراك",
    subscriptionManageBillingUpgrade: "إدارة اشتراكك وفواتيرك وترقية خطتك لفتح المزيد من الميزات",
    subscriptionCurrentPlan: "الخطة الحالية",
    subscriptionManageSubscriptionBilling: "إدارة اشتراكك وفواتيرك",
    subscriptionCancelling: "جاري الإلغاء",
    subscriptionEnds: "ينتهي",
    subscriptionNextBilling: "الفوترة التالية",
    subscriptionUsageThisMonth: "الاستخدام هذا الشهر",
    subscriptionVideosCreated: "فيديوهات تم إنشاؤها",
    subscriptionUsed: "مستخدم",
    subscriptionChangePlan: "تغيير الخطة",
    subscriptionUpdatePayment: "تحديث الدفع",
    subscriptionCancelSubscription: "إلغاء الاشتراك",
    subscriptionReactivate: "إعادة التفعيل",
    subscriptionUpgradePlan: "ترقية الخطة",
    subscriptionAvailablePlans: "الخطط المتاحة",
    subscriptionChoosePlanBestFits: "اختر الخطة التي تناسب احتياجاتك وافتح المزيد من الميزات",
    subscriptionMostPopular: "الأكثر شعبية",
    subscriptionChoosePlan: "اختر الخطة",
    subscriptionBillingHistory: "تاريخ الفوترة",
    subscriptionTrackPaymentHistory: "تتبع تاريخ مدفوعاتك وتحميل الفواتير",
    subscriptionDownload: "تحميل",
    subscriptionNoBillingHistory: "لا يوجد تاريخ فوترة",
    subscriptionBillingHistoryWillAppear: "تاريخ فوترتك سيظهر هنا",
    subscriptionErrorLoadingData: "خطأ في تحميل بيانات الاشتراك",
    subscriptionPleaseTryRefreshing: "يرجى محاولة تحديث الصفحة",
    subscriptionRefreshPage: "تحديث الصفحة",
    subscriptionChangePlanFunctionalityComingSoon: "وظيفة تغيير الخطة قريباً!",
    subscriptionUpdatePaymentFunctionalityComingSoon: "وظيفة تحديث الدفع قريباً!",
    subscriptionCancelSubscriptionFunctionalityComingSoon: "وظيفة إلغاء الاشتراك قريباً!",
    subscriptionUpgradePlanFunctionalityComingSoon: "وظيفة ترقية الخطة قريباً!",
    subscriptionDownloadInvoiceFunctionalityComingSoon: "وظيفة تحميل الفاتورة قريباً!",
    subscriptionUpgradeToPlanFunctionalityComingSoon: "ترقية إلى خطة {plan} قريباً!",
    
    // Billing Page
    billingInvoices: "الفوترة والفواتير",
    billingManageBillingInformation: "إدارة معلومات فوترتك وطرق الدفع وتتبع استخدامك",
    billingOverview: "نظرة عامة",
    billingPaymentMethods: "طرق الدفع",
    billingUsage: "الاستخدام",
    billingErrorLoadingData: "خطأ في تحميل بيانات الفوترة",
    billingPleaseTryRefreshing: "يرجى محاولة تحديث الصفحة",
    billingRefreshPage: "تحديث الصفحة",
    billingCurrentBillingPeriod: "فترة الفوترة الحالية",
    billingPeriod: "الفترة",
    billingCurrentBillingCycle: "دورة الفوترة الحالية",
    billingAmount: "المبلغ",
    billingStatus: "الحالة",
    billingFreePlan: "خطة مجانية",
    billingAutoRenewalEnabled: "التجديد التلقائي مفعل",
    billingUsageThisMonth: "الاستخدام هذا الشهر",
    billingVideosCreated: "فيديوهات تم إنشاؤها",
    billingOf: "من",
    billingStorageUsed: "التخزين المستخدم",
    billingBandwidth: "عرض النطاق",
    billingThisMonth: "هذا الشهر",
    billingInvoiceHistory: "تاريخ الفواتير",
    billingNoInvoicesYet: "لا توجد فواتير بعد",
    billingInvoiceHistoryWillAppear: "تاريخ فواتيرك سيظهر هنا",
    billingDownload: "تحميل",
    billingAddPaymentMethod: "إضافة طريقة دفع",
    billingDefault: "افتراضي",
    billingEdit: "تحرير",
    billingNoPaymentMethod: "لا توجد طريقة دفع",
    billingAddPaymentMethodToManage: "أضف طريقة دفع لإدارة اشتراكك",
    billingDetailedUsage: "استخدام مفصل",
    billingBandwidthThisMonth: "عرض النطاق هذا الشهر",
    billingUnlimited: "غير محدود",
    
    // Settings Page
    settingsTitle: "الإعدادات",
    settingsManageAccountPreferences: "إدارة تفضيلات حسابك والإشعارات وإعدادات الأمان",
    settingsMemberSince: "عضو منذ",
    settingsSaving: "جاري الحفظ...",
    settingsSaveChanges: "حفظ التغييرات",
    settingsAccountInformation: "معلومات الحساب",
    settingsEmail: "البريد الإلكتروني",
    settingsName: "الاسم",
    settingsCountry: "البلد",
    settingsSelectCountry: "اختر البلد",
    settingsNotifications: "الإشعارات",
    settingsEmailNotifications: "إشعارات البريد الإلكتروني",
    settingsReceiveNotificationsViaEmail: "تلقي الإشعارات عبر البريد الإلكتروني",
    settingsPushNotifications: "الإشعارات الفورية",
    settingsReceivePushNotificationsInBrowser: "تلقي الإشعارات الفورية في متصفحك",
    settingsMarketingEmails: "رسائل التسويق",
    settingsReceiveUpdatesAboutNewFeatures: "تلقي التحديثات حول الميزات الجديدة والنصائح",
    settingsProductUpdates: "تحديثات المنتج",
    settingsGetNotifiedAboutNewFeatures: "الحصول على إشعارات حول الميزات والتحسينات الجديدة",
    settingsPrivacySecurity: "الخصوصية والأمان",
    settingsProfileVisibility: "رؤية الملف الشخصي",
    settingsControlWhoCanSeeProfile: "التحكم في من يمكنه رؤية معلومات ملفك الشخصي",
    settingsPublic: "عام",
    settingsPrivate: "خاص",
    settingsFriendsOnly: "الأصدقاء فقط",
    settingsAnalytics: "التحليلات",
    settingsHelpUsImproveBySharing: "ساعدنا في التحسين من خلال مشاركة بيانات الاستخدام المجهولة",
    settingsDataSharing: "مشاركة البيانات",
    settingsAllowSharingDataWithPartners: "السماح بمشاركة البيانات مع شركاء الطرف الثالث",
    settingsPreferences: "التفضيلات",
    settingsTheme: "المظهر",
    settingsDark: "داكن",
    settingsLight: "فاتح",
    settingsAuto: "تلقائي",
    settingsLanguage: "اللغة",
    settingsEnglish: "English",
    settingsUkrainian: "Українська",
    settingsSpanish: "Español",
    settingsFrench: "Français",
    settingsTimezone: "المنطقة الزمنية",
    settingsUTC: "UTC",
    settingsEasternTime: "التوقيت الشرقي",
    settingsPacificTime: "التوقيت الباسيفيكي",
    settingsLondon: "لندن",
    settingsKiev: "كييف",
    settingsDateFormat: "تنسيق التاريخ",
    settingsMMDDYYYY: "MM/DD/YYYY",
    settingsDDMMYYYY: "DD/MM/YYYY",
    settingsYYYYMMDD: "YYYY-MM-DD",
    settingsDangerZone: "منطقة الخطر",
    settingsExportData: "تصدير البيانات",
    settingsDownloadCopyOfData: "تحميل نسخة من بياناتك",
    settingsExport: "تصدير",
    settingsDeleteAccount: "حذف الحساب",
    settingsPermanentlyDeleteAccount: "حذف حسابك وجميع البيانات نهائياً",
    settingsSettingsSavedSuccessfully: "تم حفظ الإعدادات بنجاح!",
    settingsErrorSavingSettings: "خطأ في حفظ الإعدادات. يرجى المحاولة مرة أخرى.",
    settingsDataExportFeatureComingSoon: "ميزة تصدير البيانات قريباً!",
    settingsAccountDeletionFeatureComingSoon: "ميزة حذف الحساب قريباً!",
    settingsAreYouSureDeleteAccount: "هل أنت متأكد من أنك تريد حذف حسابك؟ لا يمكن التراجع عن هذا الإجراء.",
    
    // Remember Me Settings
    rememberMeSettings: "إعدادات تذكرني",
    rememberMeDescription: "تذكرني يسمح لك بالبقاء مسجلاً الدخول لمدة تصل إلى 30 يوماً على الأجهزة الموثوقة. إذا كنت تستخدم جهاز كمبيوتر مشترك أو عام، ننصح بعدم استخدام هذه الميزة.",
    rememberMeClearSessions: "مسح جلسات تذكرني",
    rememberMeClearSessionsDescription: "سيؤدي هذا إلى تسجيل خروجك من جميع الأجهزة التي اخترت أن تُذكر عليها.",
    rememberMeClearing: "جاري المسح...",
    rememberMeClearAllSessions: "مسح جميع الجلسات",
    rememberMeSessionsClearedSuccessfully: "تم مسح جلسات تذكرني بنجاح",
    rememberMeFailedToClearSessions: "فشل في مسح جلسات تذكرني",
    rememberMeErrorOccurred: "حدث خطأ أثناء مسح الجلسات",
    
    // Dashboard Sidebar
    dashboardSidebarTitle: "لوحة التحكم",
    dashboardSidebarWelcomeBack: "مرحباً بعودتك",
    dashboardSidebarOverview: "نظرة عامة",
    dashboardSidebarProfile: "الملف الشخصي",
    dashboardSidebarVideos: "الفيديوهات",
    dashboardSidebarSubscription: "الاشتراك",
    dashboardSidebarBilling: "الفواتير",
    dashboardSidebarSettings: "الإعدادات",
    dashboardSidebarAccount: "الحساب",
    dashboardSidebarSignOut: "تسجيل الخروج",
    dashboardSidebarManageAccount: "إدارة حسابك وتفضيلاتك",
    
    // Admin Panel
    adminOverview: "نظرة عامة على مقاييس ومنطقيات منصتك",
    adminOverviewDescription: "نظرة عامة على مقاييس ومنطقيات منصتك",
    adminExportReport: "تصدير التقرير",
    adminRefreshing: "جاري التحديث...",
    adminRefreshData: "تحديث البيانات",
    adminTotalUsers: "إجمالي المستخدمين",
    adminTotalRevenue: "إجمالي الإيرادات",
    adminVideosCreated: "الفيديوهات المُنشأة",
    adminActiveUsers: "المستخدمون النشطون",
    adminRevenueTrend: "اتجاه الإيرادات",
    adminRevenue: "الإيرادات",
    adminUserActivity: "نشاط المستخدمين",
    adminActiveUsers: "المستخدمون النشطون",
    adminChartVisualizationComingSoon: "تصور الرسوم البيانية قريباً",
    adminRecentActivity: "النشاط الأخير",
    adminNoRecentActivity: "لا يوجد نشاط حديث",
    adminActivityWillAppearHere: "سيظهر النشاط هنا عندما يتفاعل المستخدمون مع المنصة",
    adminErrorLoadingData: "خطأ في تحميل بيانات الإدارة",
    adminTryAgain: "حاول مرة أخرى",
    adminNetworkErrorOccurred: "حدث خطأ في الشبكة",
    
    // Admin Users Management
    adminUsersManagement: "إدارة المستخدمين",
    adminUsersManagementDescription: "إدارة مستخدمي المنصة وحساباتهم وأذوناتهم",
    adminAddUser: "إضافة مستخدم",
    adminSearchFilters: "البحث والمرشحات",
    adminSearchUsers: "البحث عن المستخدمين...",
    adminAllStatus: "جميع الحالات",
    adminActive: "نشط",
    adminInactive: "غير نشط",
    adminSuspended: "معلق",
    adminAllSubscriptions: "جميع الاشتراكات",
    adminFree: "مجاني",
    adminBasic: "أساسي",
    adminPremium: "مميز",
    adminEnterprise: "مؤسسي",
    adminSortByJoinDate: "ترتيب حسب تاريخ الانضمام",
    adminSortByName: "ترتيب حسب الاسم",
    adminSortByEmail: "ترتيب حسب البريد الإلكتروني",
    adminSortByLastActive: "ترتيب حسب آخر نشاط",
    adminSortByVideos: "ترتيب حسب الفيديوهات",
    adminSortByTotalSpent: "ترتيب حسب إجمالي الإنفاق",
    adminUsersSelected: "مستخدمين محددين",
    adminUserSelected: "مستخدم محدد",
    adminActivate: "تفعيل",
    adminSuspend: "تعليق",
    adminDelete: "حذف",
    adminClear: "مسح",
    adminUser: "المستخدم",
    adminStatus: "الحالة",
    adminSubscription: "الاشتراك",
    adminVideos: "الفيديوهات",
    adminTotalSpent: "إجمالي الإنفاق",
    adminLastActive: "آخر نشاط",
    adminActions: "الإجراءات",
    adminShowingUsers: "عرض",
    adminOfUsers: "من",
    adminPrevious: "السابق",
    adminNext: "التالي",
    adminEditUser: "تعديل المستخدم",
    adminName: "الاسم",
    adminEmail: "البريد الإلكتروني",
    adminRole: "الدور",
    adminUserRole: "مستخدم",
    adminAdminRole: "مدير",
    adminModeratorRole: "مشرف",
    adminSaveChanges: "حفظ التغييرات",
    adminCancel: "إلغاء",
    adminUserUpdatedSuccessfully: "تم تحديث المستخدم بنجاح!",
    adminFailedToUpdateUser: "فشل في تحديث المستخدم:",
    adminErrorUpdatingUser: "خطأ في تحديث المستخدم",
    adminAreYouSureDeleteUsers: "هل أنت متأكد من أنك تريد حذف",
    adminUsersDeletedSuccessfully: "مستخدمين تم حذفهم بنجاح!",
    adminFailedToDeleteUsers: "فشل في حذف المستخدمين:",
    adminErrorPerformingAction: "خطأ في تنفيذ",
    adminActionComingSoon: "إجراء لـ",
    
    // Admin Videos Management
    adminVideosModeration: "إدارة الفيديوهات",
    adminVideosModerationDescription: "مراجعة ومراقبة محتوى الفيديو الذي حمله المستخدمون",
    adminVideosToReview: "فيديو للمراجعة",
    adminVideosSearchFilters: "البحث والمرشحات",
    adminVideosSearch: "البحث",
    adminVideosSearchPlaceholder: "البحث في الفيديوهات أو المحملين...",
    adminVideosStatus: "الحالة",
    adminVideosAllStatus: "جميع الحالات",
    adminVideosPending: "في الانتظار",
    adminVideosApproved: "موافق عليه",
    adminVideosRejected: "مرفوض",
    adminVideosSortBy: "ترتيب حسب",
    adminVideosUploadDate: "تاريخ التحميل",
    adminVideosTitle: "العنوان",
    adminVideosUploader: "المحمل",
    adminVideosFlags: "العلم",
    adminVideosOrder: "الترتيب",
    adminVideosNewestFirst: "الأحدث أولاً",
    adminVideosOldestFirst: "الأقدم أولاً",
    adminVideosReview: "مراجعة",
    adminVideosReason: "السبب",
    adminVideosViews: "مشاهدة",
    adminVideosLikes: "إعجاب",
    adminVideosFlagsCount: "علم",
    adminVideosReviewVideo: "مراجعة الفيديو",
    adminVideosVideoInformation: "معلومات الفيديو",
    adminVideosDuration: "المدة",
    adminVideosCategory: "الفئة",
    adminVideosUploadDate: "تاريخ التحميل",
    adminVideosFlagsCount: "الأعلام",
    adminVideosUploaderInformation: "معلومات المحمل",
    adminVideosDescription: "الوصف",
    adminVideosTags: "العلامات",
    adminVideosReject: "رفض",
    adminVideosApprove: "موافقة",
    adminVideosEnterRejectionReason: "أدخل سبب الرفض:",
    adminVideosVideoPlayer: "مشغل الفيديو",
    adminVideosClickToPlay: "انقر للتشغيل",
    
    // Admin Scheduler Management
    adminSchedulerPublicationScheduler: "مجدول النشر",
    adminSchedulerScheduleVideoPublications: "جدولة منشورات الفيديو عبر الشبكات الاجتماعية",
    adminSchedulerScheduleNewPost: "+ جدولة منشور جديد",
    adminSchedulerSearchFilters: "البحث والمرشحات",
    adminSchedulerStatusFilter: "مرشح الحالة",
    adminSchedulerAllStatus: "جميع الحالات",
    adminSchedulerScheduled: "مجدول",
    adminSchedulerPublished: "منشور",
    adminSchedulerFailed: "فشل",
    adminSchedulerCancelled: "ملغي",
    adminSchedulerSocialNetwork: "الشبكة الاجتماعية",
    adminSchedulerAllNetworks: "جميع الشبكات",
    adminSchedulerDuration: "المدة",
    adminSchedulerCategory: "الفئة",
    adminSchedulerPublishesIn: "ينشر خلال",
    adminSchedulerPublishNow: "نشر الآن",
    adminSchedulerCancel: "إلغاء",
    adminSchedulerScheduleNewPost: "جدولة منشور جديد",
    adminSchedulerSelectVideo: "اختر الفيديو *",
    adminSchedulerSelectSocialNetworks: "اختر الشبكات الاجتماعية *",
    adminSchedulerPublicationDate: "تاريخ النشر *",
    adminSchedulerPublicationTime: "وقت النشر *",
    adminSchedulerCustomMessage: "رسالة مخصصة",
    adminSchedulerCustomMessageOptional: "رسالة مخصصة (اختياري)",
    adminSchedulerCustomMessagePlaceholder: "أضف رسالة مخصصة ترافق فيديوك...",
    adminSchedulerCancel: "إلغاء",
    adminSchedulerSchedulePost: "جدولة المنشور",
    adminSchedulerScheduling: "جاري الجدولة...",
    adminSchedulerPleaseSelectVideo: "يرجى اختيار فيديو",
    adminSchedulerPleaseSelectNetwork: "يرجى اختيار شبكة اجتماعية واحدة على الأقل",
    adminSchedulerPleaseSelectDate: "يرجى اختيار تاريخ النشر",
    adminSchedulerPleaseSelectTime: "يرجى اختيار وقت النشر",
    adminSchedulerPostScheduledSuccessfully: "تم جدولة المنشور بنجاح!",
    adminSchedulerFailedToSchedulePost: "فشل في جدولة المنشور. يرجى المحاولة مرة أخرى.",
    adminSchedulerErrorSchedulingPost: "خطأ في جدولة المنشور. يرجى المحاولة مرة أخرى.",
    adminSchedulerFailedToCancelPost: "فشل في إلغاء المنشور. يرجى المحاولة مرة أخرى.",
    adminSchedulerErrorCancellingPost: "خطأ في إلغاء المنشور. يرجى المحاولة مرة أخرى.",
    adminSchedulerFailedToPublishPost: "فشل في نشر المنشور. يرجى المحاولة مرة أخرى.",
    adminSchedulerErrorPublishingPost: "خطأ في نشر المنشور. يرجى المحاولة مرة أخرى.",
    adminSchedulerOverdue: "متأخر",
    
    // Admin Payments Management
    adminPaymentsPaymentManagement: "إدارة المدفوعات",
    adminPaymentsViewManageTransactions: "عرض وإدارة معاملات الدفع",
    adminPaymentsTransactions: "معاملات",
    adminPaymentsSearchFilters: "البحث والمرشحات",
    adminPaymentsSearch: "بحث",
    adminPaymentsSearchPlaceholder: "البحث في المعاملات...",
    adminPaymentsStatus: "الحالة",
    adminPaymentsAllStatus: "جميع الحالات",
    adminPaymentsPending: "في الانتظار",
    adminPaymentsCompleted: "مكتمل",
    adminPaymentsFailed: "فشل",
    adminPaymentsRefunded: "مسترد",
    adminPaymentsCancelled: "ملغي",
    adminPaymentsType: "النوع",
    adminPaymentsAllTypes: "جميع الأنواع",
    adminPaymentsSubscription: "اشتراك",
    adminPaymentsOneTime: "مرة واحدة",
    adminPaymentsRefund: "استرداد",
    adminPaymentsUpgrade: "ترقية",
    adminPaymentsDateRange: "نطاق التاريخ",
    adminPaymentsAllTime: "كل الوقت",
    adminPaymentsToday: "اليوم",
    adminPaymentsThisWeek: "هذا الأسبوع",
    adminPaymentsThisMonth: "هذا الشهر",
    adminPaymentsThisYear: "هذا العام",
    adminPaymentsTotalRevenue: "إجمالي الإيرادات",
    adminPaymentsCompleted: "مكتمل",
    adminPaymentsPending: "في الانتظار",
    adminPaymentsFailed: "فشل",
    adminPaymentsInvoice: "فاتورة",
    adminPaymentsConfirm: "تأكيد",
    adminPaymentsCancel: "إلغاء",
    adminPaymentsRefund: "استرداد",
    adminPaymentsView: "عرض",
    adminPaymentsTransactionDetails: "تفاصيل المعاملة",
    adminPaymentsTransactionInformation: "معلومات المعاملة",
    adminPaymentsUserInformation: "معلومات المستخدم",
    adminPaymentsAdditionalInformation: "معلومات إضافية",
    adminPaymentsPlan: "الخطة",
    adminPaymentsBilling: "الفوترة",
    adminPaymentsDiscount: "خصم",
    adminPaymentsTax: "ضريبة",
    adminPaymentsCancelPayment: "إلغاء الدفع",
    adminPaymentsRefund: "استرداد",
    adminPaymentsConfirmPayment: "تأكيد الدفع",
    adminPaymentsEnterCancellationReason: "أدخل سبب الإلغاء:",
    adminPaymentsEnterRefundReason: "أدخل سبب الاسترداد:",
    adminPaymentsFailedToConfirmPayment: "فشل في تأكيد الدفع. يرجى المحاولة مرة أخرى.",
    adminPaymentsErrorConfirmingPayment: "خطأ في تأكيد الدفع. يرجى المحاولة مرة أخرى.",
    adminPaymentsRefundFunctionalityWouldBeImplemented: "ستتم تنفيذ وظيفة الاسترداد هنا",
    adminPaymentsErrorProcessingRefund: "خطأ في معالجة الاسترداد. يرجى المحاولة مرة أخرى.",
    adminPaymentsFailedToCancelPayment: "فشل في إلغاء الدفع. يرجى المحاولة مرة أخرى.",
    adminPaymentsErrorCancellingPayment: "خطأ في إلغاء الدفع. يرجى المحاولة مرة أخرى.",
    
    // Admin Tickets Management
    adminTicketsSupportTickets: "تذاكر الدعم",
    adminTicketsManageCustomerSupport: "إدارة تذاكر دعم العملاء للعملاء المميزين",
    adminTicketsTickets: "تذاكر",
    adminTicketsSearchFilters: "البحث والمرشحات",
    adminTicketsSearch: "بحث",
    adminTicketsSearchPlaceholder: "البحث في التذاكر...",
    adminTicketsStatus: "الحالة",
    adminTicketsAllStatus: "جميع الحالات",
    adminTicketsOpen: "مفتوح",
    adminTicketsInProgress: "قيد التقدم",
    adminTicketsResolved: "محلول",
    adminTicketsClosed: "مغلق",
    adminTicketsPriority: "الأولوية",
    adminTicketsAllPriority: "جميع الأولويات",
    adminTicketsUrgent: "عاجل",
    adminTicketsHigh: "عالي",
    adminTicketsMedium: "متوسط",
    adminTicketsLow: "منخفض",
    adminTicketsCategory: "الفئة",
    adminTicketsAllCategories: "جميع الفئات",
    adminTicketsTechnical: "تقني",
    adminTicketsBilling: "الفوترة",
    adminTicketsFeatureRequest: "طلب ميزة",
    adminTicketsBugReport: "تقرير خطأ",
    adminTicketsGeneral: "عام",
    adminTicketsSubscription: "الاشتراك",
    adminTicketsAllSubscriptions: "جميع الاشتراكات",
    adminTicketsPremium: "مميز",
    adminTicketsEnterprise: "مؤسسة",
    adminTicketsTotalTickets: "إجمالي التذاكر",
    adminTicketsOpen: "مفتوح",
    adminTicketsInProgress: "قيد التقدم",
    adminTicketsResolved: "محلول",
    adminTicketsUrgent: "عاجل",
    adminTicketsView: "عرض",
    adminTicketsAssignedTo: "مُعيّن لـ",
    adminTicketsMessages: "رسائل",
    adminTicketsTicketInformation: "معلومات التذكرة",
    adminTicketsUserInformation: "معلومات المستخدم",
    adminTicketsDescription: "الوصف",
    adminTicketsConversation: "المحادثة",
    adminTicketsAssignToMe: "تعيين لي",
    adminTicketsTypeYourResponse: "اكتب ردك...",
    adminTicketsSend: "إرسال",
    adminTicketsFailedToSendMessage: "فشل في إرسال الرسالة. يرجى المحاولة مرة أخرى.",
    adminTicketsErrorSendingMessage: "خطأ في إرسال الرسالة. يرجى المحاولة مرة أخرى.",
    adminTicketsFailedToUpdateStatus: "فشل في تحديث الحالة. يرجى المحاولة مرة أخرى.",
    adminTicketsErrorUpdatingStatus: "خطأ في تحديث الحالة. يرجى المحاولة مرة أخرى.",
    adminTicketsFailedToAssignTicket: "فشل في تعيين التذكرة. يرجى المحاولة مرة أخرى.",
    adminTicketsErrorAssigningTicket: "خطأ في تعيين التذكرة. يرجى المحاولة مرة أخرى.",
    adminTicketsJustNow: "الآن",
    adminTicketsHoursAgo: "ساعة مضت",
    adminTicketsDaysAgo: "يوم مضى",

    // Admin Sidebar
    adminSidebarDashboard: "لوحة التحكم",
    adminSidebarUsers: "المستخدمون",
    adminSidebarVideoModeration: "إشراف الفيديو",
    adminSidebarPublicationScheduler: "جدولة النشر",
    adminSidebarPaymentManagement: "إدارة المدفوعات",
    adminSidebarTicketSystem: "نظام التذاكر",
    adminSidebarAdminPanel: "لوحة الإدارة",
    adminSidebarManagePlatform: "إدارة منصتك وتحليلاتك",
    adminSidebarSignOut: "تسجيل الخروج",

    // Admin Header
    adminHeaderDashboard: "لوحة التحكم",
    adminHeaderUsers: "المستخدمون",
    adminHeaderVideoModeration: "إشراف الفيديو",
    adminHeaderPublicationScheduler: "جدولة النشر",
    adminHeaderPaymentManagement: "إدارة المدفوعات",
    adminHeaderTicketSystem: "نظام التذاكر",
    adminHeaderAdminPanel: "لوحة الإدارة",
    adminHeaderManagePlatform: "إدارة منصتك وتحليلاتك",
    adminHeaderSearch: "بحث",
    adminHeaderSearchPlaceholder: "بحث...",
    adminHeaderNotifications: "الإشعارات",
    adminHeaderNewUserRegistered: "مستخدم جديد مسجل",
    adminHeaderVideoProcessingCompleted: "اكتمل معالجة الفيديو",
    adminHeaderSystemBackupCompleted: "اكتمل النسخ الاحتياطي للنظام",
    adminHeaderMinutesAgo: "دقائق مضت",
    adminHeaderHourAgo: "ساعة مضت",
    adminHeaderAdminUser: "مستخدم الإدارة",
  },
};

export function getTranslations(language: Language): Translations {
  return translations[language] || translations.en;
}

export function getCurrentLanguage(): Language {
  if (typeof window === 'undefined') return 'en';
  
  const stored = localStorage.getItem('preferredLanguage') as Language;
  if (stored && translations[stored]) return stored;
  
  const browserLang = navigator.language.split('-')[0] as Language;
  if (browserLang && translations[browserLang]) return browserLang;
  
  return 'en';
}
