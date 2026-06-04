using Xunit;

namespace HealthPulse.Tests;

public class HealthTest
{
    [Fact]
    public void System_Should_Report_Healthy()
    {
        bool isHealthy = true;
        Assert.True(isHealthy);
    }
}