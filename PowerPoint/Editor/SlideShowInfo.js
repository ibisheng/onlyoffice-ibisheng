function CTransition() {
    this.bAudioPresent		= false;
    this.m_nEffectType		= 0;
    this.nEffectDirection	= 0;

    this.bLoopSound		= false;
    this.bStopSound		= false;

    this.dSpeed			= 500.0;
}

CTransition.prototype =
{
    Set: function(oTransition)
    {
        this.bAudioPresent		= oTransition.bAudioPresent;

        this.m_nEffectType		= oTransition.m_nEffectType;
        this.nEffectDirection	= oTransition.nEffectDirection;

        this.bLoopSound		= oTransition.bLoopSound;
        this.bStopSound		= oTransition.bStopSound;

        this.dSpeed			= oTransition.dSpeed;
    }
};

function CSlideShowInfo()
{
    this.nSlideDuration = 30000.0;
    this.bHidden = false;

    this.oTransition = new CTransition();

    this.bOnlyClick = false;
}

CSlideShowInfo.prototype =
{
    Set: function(oSlideShowInfo)
    {
        this.nSlideDuration = oSlideShowInfo.nSlideDuration;
        this.bHidden = oSlideShowInfo.bHidden;

        this.oTransition.Set(oSlideShowInfo.oTransition);

        this.bOnlyClick = oSlideShowInfo.bOnlyClick;
    }
}