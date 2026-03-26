"""YouTube transcript extraction service."""

import re
from typing import Optional
from youtube_transcript_api import YouTubeTranscriptApi
from youtube_transcript_api._errors import TranscriptsDisabled, NoTranscriptFound


class YouTubeService:
    """Extract transcripts from YouTube videos."""
    
    @staticmethod
    def extract_video_id(url: str) -> Optional[str]:
        """Extract video ID from various YouTube URL formats."""
        patterns = [
            r"(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})",
            r"^([a-zA-Z0-9_-]{11})$"  # Just the video ID
        ]
        
        for pattern in patterns:
            match = re.search(pattern, url)
            if match:
                return match.group(1)
        return None
    
    @classmethod
    def get_transcript(cls, video_url: str, language: str = "en") -> dict:
        """Get transcript from a YouTube video."""
        video_id = cls.extract_video_id(video_url)
        
        if not video_id:
            return {
                "success": False,
                "error": "Invalid YouTube URL. Could not extract video ID."
            }
        
        try:
            # Try to get transcript in requested language
            transcript_list = YouTubeTranscriptApi.list_transcripts(video_id)
            
            try:
                transcript = transcript_list.find_transcript([language])
            except NoTranscriptFound:
                # Try to get any available transcript
                transcript = transcript_list.find_generated_transcript(['en', 'en-US', 'en-GB'])
            
            transcript_data = transcript.fetch()
            
            # Combine all transcript entries
            full_text = " ".join([entry["text"] for entry in transcript_data])
            
            return {
                "success": True,
                "video_id": video_id,
                "transcript": full_text,
                "language": transcript.language,
                "word_count": len(full_text.split())
            }
            
        except TranscriptsDisabled:
            return {
                "success": False,
                "video_id": video_id,
                "error": "Transcripts are disabled for this video."
            }
        except NoTranscriptFound:
            return {
                "success": False,
                "video_id": video_id,
                "error": f"No transcript found for language '{language}' or English."
            }
        except Exception as e:
            return {
                "success": False,
                "video_id": video_id,
                "error": f"Error fetching transcript: {str(e)}"
            }
